
> **Architecture Study.** This is a hypothetical system study. The scale figures, SLAs,
> and design choices are illustrative and do not describe any specific employer or
> production system. The aim is to reason from first principles about a class of problem —
> large-scale, multi-tenant LLM inference — that recurs across every serious AI product.

## 1. Executive summary

We studied a hypothetical platform that serves **hundreds of LLMs** to many internal
product teams: take a request for a named model, schedule it onto a GPU, run the forward
pass, and stream tokens back — plus the control plane to deploy, version, scale, and
observe those models. Training is out of scope; models arrive as artifacts. The primary
workload is **interactive streaming chat** with a genuine mix of **prefill-bound and
decode-bound** traffic, a TTFT (time to first token) P99 under ~1 second, ~40 tokens/sec
streaming, and a mandate to **minimize cost subject to hitting the SLO**.

One sentence carries the whole design: **almost every decision is a position on the
throughput–latency–cost triangle, and that triangle is really about one scarce resource —
GPU memory and GPU time.** Batch harder and throughput rises but tail latency suffers; keep
a bigger warm buffer and reliability improves but the bill grows; disaggregate prefill and
decode and latency isolation improves but operational complexity doubles. On this platform
you don't buy performance and reliability with clever protocols — you buy them with spare
silicon, which makes the cost dial unusually direct. The other recurring protagonist is the
**KV cache**: it, not raw compute, is what caps batch size, throughput, and therefore cost.
This is the walkthrough.

## 2. Requirements and the workload that shapes everything

The functional surface splits along the **two-plane** model every serving platform
converges on. The **data plane** serves generation and embeddings, streaming and unary,
with full generation controls (max tokens, temperature, top-p, stop sequences), targets a
specific model, version, and **LoRA adapter**, and supports **request prioritization** and
input **guardrails/moderation** (both in scope). The **control plane** registers, versions,
canary-rolls-out, rolls back, and undeploys models through a registry, and handles
per-tenant auth, quotas, and token metering. Out of scope: training, RAG retrieval (we
receive the assembled prompt), and the billing system itself (we emit usage events).

Non-functionally, latency has **two** dimensions, not one — **TTFT** (perceived
responsiveness) and **inter-token latency / TPOT** (streaming smoothness) — and we anchor
on **P99**, because the tail is what users feel. Cost is treated as a **first-class SLO**,
not a footnote, because the GPU fleet *is* the system's cost. Availability is defined as
**served-within-SLO** (a request that returns in 30 seconds is a failure even with an HTTP
200), targeting three nines for v1. The data plane is essentially stateless per request, so
strong consistency is a **control-plane-only** concern — eventual but durable on the order
of seconds — which sidesteps a whole class of CAP hand-wringing that doesn't apply here.

The single most consequential detail is the **mixed prefill/decode workload**, so it's
worth making concrete before any architecture.

![Prefill vs decode: two phases that fight on a shared GPU, and the two fixes](/images/inf-prefill-decode.svg)
*Figure 1. Prefill processes the whole prompt in one compute-bound pass; decode generates tokens one at a time, memory-bandwidth-bound. Run both naively on one GPU and a long prefill stalls everyone's token streaming.*

This tension — a chunky prefill monopolizing a step and blowing every other request's
inter-token latency — is exactly what a mixed workload produces, and it's what will justify
**chunked prefill** and eventually **disaggregated serving** later. We park the fix and
carry the constraint forward.

## 3. Scale estimation — requests is the wrong unit

The math runs from users straight to a GPU count and a dollar figure, which is ultimately
what the design lives or dies on.

![Scale estimation: tokens not requests, GPU count, cost, and the KV binding constraint](/images/inf-scale-numbers.svg)
*Figure 2. ~200M DAU → ~2B requests/day → ~50K peak QPS. Converted to tokens, that's ~25M input and ~15M output tokens/sec — and the GPUs only care about tokens.*

At ~50K peak QPS with a 500-in / 300-out token profile, the platform must serve **~25M
input tokens/sec** (prefill, compute-bound) and **~15M output tokens/sec** (decode,
memory-bound) — a ~1.7:1 ratio that becomes the pool-sizing ratio if we disaggregate.
Anchoring on a working figure of ~2,500 decode tokens/sec/GPU for a mid-size model on an
H100, decode alone needs 15M ÷ 2,500 = 6,000 GPUs at 100% utilization, or **~10,000 at a
realistic 60%**, plus ~1–2K for prefill — a **10,000–12,000-GPU fleet** costing **~$200M+
a year**. At that scale a 1% throughput improvement is ~100 GPUs ≈ ~$2M/year, which is why
batching and disaggregation aren't premature optimization — each is worth eight figures.

Two things are deliberately *not* the bottleneck. Network egress is trivial (~60 MB/s of
actual token payload); the bandwidth that matters is **GPU memory bandwidth** and the
**interconnect** (NVLink/InfiniBand) carrying tensor-parallel traffic. And the binding
constraint on throughput is **KV-cache memory**, not compute. The one assumption most worth
validating is that ~2,500 tokens/sec/GPU figure — everything downstream scales off it,
which is precisely what a benchmarking platform measures per model and per hardware type.

## 4. Architecture — a stateless shell around a scarce GPU core

The shape follows from the estimation: a cheap, infinitely-scalable stateless front end
wrapped around a precious, carefully-managed GPU core, with a control plane that manages
that core without ever sitting in its critical path.

![Two-plane inference platform architecture](/images/inf-architecture.svg)
*Figure 3. The data-plane hot path (load balancer → gateway → router → serving pool, tokens streaming back) is where latency and GPUs live; the control plane deploys and scales the fleet off the hot path.*

A request hits an **API Gateway** that does the cheap, CPU-bound work — auth, quota, rate
limiting, **input moderation** (reject before a single second of GPU is spent), and
idempotency-key checks — none of which touches a GPU, so it scales horizontally and
cheaply. The authenticated, clean request reaches the **Inference Router**, the brain of
the data plane: it resolves model + version + adapter + priority and decides which pool and
replica should serve it. The router hands off to a **Model Serving Pool** of vLLM replicas,
optionally split into **prefill** and **decode** sub-pools, with the **KV / prefix cache**
attached. Tokens stream back out through the gateway (one consistent place for auth,
metering, and connection management) over SSE.

The two design decisions worth stating: the **control plane is fully off the hot path** —
if the registry or orchestrator dies, in-flight inference keeps serving because the router
runs off a **cached routing table** (the eventual-but-durable consistency we accepted) —
and **everything is stateless except the GPU pools and the stores**, so the genuinely hard,
expensive, stateful thing is the serving pool. That's exactly where the rest of the design
effort concentrates.

## 5. The serving pool — the part that determines good vs bankrupt

Everything outside this box is plumbing you'd find on any system. This is where the
LLM-specific engineering lives, and it's best understood by feeling the constraint from the
single-GPU problem outward.

The naive design — one request per GPU until done — is catastrophic. Decode is
memory-bandwidth-bound, so generating one token barely uses the math units; you're mostly
reading weights out of memory. Serve one request at a time and the compute sits ~95% idle
while you pay full freight for the memory traffic. **The entire art of LLM serving is
filling that idle compute by running many requests at once.**

![Continuous batching, the KV cache, and PagedAttention](/images/inf-kv-batching.svg)
*Figure 4. Continuous batching keeps the GPU densely packed despite wildly varying request lengths; the KV cache is the binding resource; PagedAttention pages it like virtual memory to near-eliminate waste.*

**Continuous (in-flight) batching** is the foundation. Instead of a fixed batch where
everyone waits for the slowest request, the engine works at the granularity of a single
decode step: each step emits one token per active request, finished requests leave
immediately, and waiting ones join on the next step. The batch is a living set. This is
non-negotiable at scale — a static-batching server needs roughly 2–4× the GPUs for the same
SLO.

The binding constraint is the **KV cache** — the per-token, per-request attention state that
lives in GPU memory. On an 80 GB H100 hosting a ~16 GB model, ~60 GB is left for KV, and
that, not compute, caps how many requests batch together. **PagedAttention** earns its keep
here: classic serving reserves a contiguous block per request sized to the maximum possible
length, wasting most of it; PagedAttention chops KV into fixed-size pages allocated on
demand, taking utilization from ~40% to ~95% — roughly **2× effective throughput**, which
at our fleet size is thousands of GPUs. Once KV is block-structured, **prefix caching**
falls out: reuse the computed KV blocks of a shared system prompt or RAG context across
requests and skip that prefill entirely.

The mixed workload forces the big fork from Figure 1. The lighter fix, **chunked prefill**,
dices a long prefill into chunks interleaved with decode steps on one homogeneous pool —
the default first reach. The heavier fix, justified at our scale, is **disaggregated
serving**: physically separate prefill and decode GPUs, handing the computed KV cache across
the interconnect. Each pool is sized independently (that 1.7:1 ratio), prefill bursts can
never stall decode, and — crucially for the next section — **you can use different GPU types
for each phase**. The cost is real: KV-transfer bandwidth and a doubled operational surface.
So: chunked prefill on a unified pool first, graduate to disaggregation at 10K+ GPUs.

Two more pieces live here. For models too big for one GPU, **tensor parallelism** shards
each layer across GPUs within a node up to the NVLink boundary; **pipeline parallelism**
spans nodes only when forced. And for the many fine-tuned variants, **multi-LoRA serving**
keeps one base model resident and dynamically applies tiny adapters — even batching
different adapters together — collapsing dozens of would-be deployments onto one pool. If
there's one bottleneck in this entire box, it's **KV-cache memory capacity, full stop**.

## 6. Heterogeneous GPUs — right model, right phase, right hardware

At 10K+ GPUs, treating the fleet as uniform leaves money on the table. The cost lever is
matching each workload to the cheapest hardware that still meets its SLO — and disaggregation
makes this natural, because prefill and decode want *different* GPUs.

![Mapping models and phases to a heterogeneous GPU fleet](/images/inf-gpu-fleet.svg)
*Figure 5. Five GPU classes, three placement signals. Decode is bandwidth-bound and wants high-HBM cards; prefill is compute-bound and wants compute-dense cards; small models and embeddings want cheap, efficient cards.*

The fleet spans, roughly: the **H100** (80 GB HBM3, ~3.35 TB/s) for big tensor-parallel
models, large prefill, and high-throughput decode; the **A100** (80 GB HBM2e, ~2 TB/s) as
the workhorse for mid-to-large models and steady decode at lower cost; the **RTX Pro 6000**
(96 GB GDDR7, Blackwell) whose large single-card memory fits a bigger model — or a larger KV
budget — on one device cost-effectively; the **L40S** (48 GB, compute-dense Ada with strong
FP8) for prefill compute and mid-size models; and the **L4** (24 GB, ~72 W, cheap and
efficient) for small models, embeddings, and the cost-sensitive long tail.

Three signals decide placement. **By model size**: a 7B fits one L4 or L40S, a 70B needs
tensor parallelism on H100/A100, and a 96 GB RTX Pro 6000 can hold a bigger model on a
single card. **By phase**: route compute-bound prefill to compute-dense cards (L40S, H100)
and bandwidth-bound decode to high-HBM-bandwidth cards (H100, A100) — disaggregation made
physical. **By cost-per-token**: the router scores cost-to-serve, not just latency, so an L4
can win cost-per-token for a small model even where an H100 wins raw throughput. The
principle is simple and worth millions: **serve each workload on the cheapest hardware that
still hits its SLO.**

## 7. The router, scheduling, and graceful saturation

The router can't be a normal load balancer, because neither of a load balancer's assumptions
holds: our requests vary ~100× in cost (a 10-token reply vs a 4,000-token generation), and
our replicas aren't interchangeable — each has different KV headroom, queue depth, and a
different set of adapters and prefixes already hot.

![Load/cache-aware routing, priority queues, and graceful saturation](/images/inf-router.svg)
*Figure 6. The router selects on KV headroom + queue depth + cache affinity, runs priority-aware queues with aging, and degrades through backpressure → load-shedding → circuit breakers.*

Replica selection routes on a composite signal — **most free KV-cache headroom** (the
binding resource), **shortest queue**, and a **cache-affinity bonus** toward replicas that
already have this request's adapter or prefix resident. Perfect global state is impossible at
10K replicas, so the router uses slightly-stale heartbeated metrics and
**power-of-two-choices** sampling. Priority scheduling runs a few tiers (interactive,
default, batch) drained high-first, but with **aging** so sustained interactive load can't
starve batch forever.

When the fleet saturates — which it will, because GPUs can't scale in seconds — the router
degrades in order: **backpressure** via bounded queues (an unbounded queue under overload
just converts a throughput problem into a latency catastrophe), then **load-shedding** that
drops the lowest priority first with a fast 429 + Retry-After (**a fast rejection beats a
slow success**), then **circuit breakers** on failing replicas with bounded, budgeted,
jittered backoff so retries can't become a self-inflicted DDoS. Inside the pool, **preemption**
— evict a request's KV cache and re-run its prefill later — is the last-resort safety valve
that prevents out-of-memory crashes, since generation length is unknown at admission time.

## 8. Autoscaling and capacity planning

This is where an inference platform diverges most sharply from a normal web service:
**cold start is minutes, not seconds** — schedule onto a GPU node, pull multi-GB weights,
load, warm up. By the time a reactively-scaled GPU is ready, the spike is over. So the design
attacks it from several angles. **Scale on the right signal** — queue depth, KV utilization,
and tokens/sec headroom, never CPU. **Scale predictively** — inference traffic follows a
diurnal curve, so pre-warm against a forecast and use reactive scaling only for the residual.
Keep a **warm buffer** of idle replicas as a shock absorber (an explicit cost-versus-resilience
dial). **Cut the cold start** with node-local weight caches and LoRA-only swaps. And **scale
down lazily** with hysteresis — scale up eagerly, down slowly — to avoid paying the cold-start
cost repeatedly. Stepping up, **capacity is a planning problem first and an autoscaling
problem second**: at 10K+ GPUs with multi-month procurement lead times, you forecast token
demand on a quarterly horizon and reserve fleet ahead of need; autoscaling only handles the
daily wiggle within capacity you've already secured.

## 9. API, caching, reliability

The **API** is REST + Server-Sent Events externally (the de-facto LLM shape, streams over
plain HTTP) and gRPC internally; a `POST /v1/generate` carries model/version/adapter,
generation controls, a `priority` tier, and an `Idempotency-Key`, and returns a first-class
`usage` block (so metering and the caller agree on token counts) and a `finish_reason`.
**Rate limiting is token-based, not request-based** — one request can be 100× another's cost,
so requests-per-minute is meaningless; the real limit is tokens-per-minute, surfaced via
`X-RateLimit` headers with 429 + Retry-After on breach. Idempotency keys (held in Redis with
a 24 h TTL and a *pending* state for in-flight retries) make our **at-least-once + idempotent
dedup = effectively-once** semantic real.

**Caching** is two different animals. GPU-resident caching (KV per request, prefix cache) is
the expensive, LLM-specific layer; the prefix cache is **immutable** — the same tokens through
the same model version always produce the same KV state — so it has *no invalidation hazard*,
only weighted-LRU eviction, and it competes directly with live KV for memory. Conventional
Redis caching serves idempotency (correctness), the routing-table cache (the data plane's
independence from the control plane), and atomic quota counters. **Stampede prevention** uses
single-flight coalescing (one request prefills a hot shared prefix while the rest reuse it,
not 500 redundant prefills), jittered TTLs, probabilistic early expiration, and
serve-stale-while-revalidate — plus staggered weight pulls so a scale-up doesn't herd the
artifact store.

**Reliability** spends its budget asymmetrically. The stateless tier is N+2 multi-AZ
(provisioned for N-1 survival) and trivially recoverable. The GPU tier is the hard part,
because a replica holds **non-replicable in-flight KV state** — when it dies, those
generations are gone. The defenses: continuous batching **bounds the blast radius** (one
replica is hundreds of requests, not millions); idempotent retry **recovers** lost requests
on a healthy replica (the idempotency key is also our internal failure-recovery mechanism);
"replication" means replicating **capacity** (≥2 AZ-spread replicas per model), not data; and
the **warm buffer does double duty** as a failure absorber against the brutal cold-start
recovery time. The control plane is deliberately **not a SPOF** for serving, and all the
leader-election/quorum machinery is confined to it. Multi-region is the four-nines step we
defer because it roughly doubles the GPU bill. The honest framing: you don't buy GPU
reliability with protocols — you buy it with spare GPUs.

## 10. Observability, security, and async

**Observability** has a third question no CRUD service has: not just "is it up and fast?" but
**"is it still good?"** A model can be perfectly available and fast while silently producing
worse output. So three layers: infra metrics; inference-performance metrics (TTFT, ITL,
GPU/KV utilization, queue depth, tokens/sec/GPU — where KV utilization and queue depth are
**leading indicators** that double as the autoscaler's control signals); and the hard
**quality layer**. Phase-level **tracing** (queue → moderation → prefill → decode → network)
is what makes latency debuggable — the same total TTFT means something different if it's
queue wait (scale up) vs a long prefill (chunked prefill) vs over-large decode batches (back
off). Silent degradation is caught with cheap always-on proxies (output-length distribution,
finish_reason mix, refusal and guardrail-trip rates), online signals (thumbs, regeneration
rate), and **shadow/canary evaluation that gates rollouts** — the benchmarking framework doing
production duty.

**Security** here is woven through the data path because every request can carry sensitive
content. Stateless JWT/OAuth + API-key auth at the gateway (short TTLs to manage the
revocation tradeoff); per-tenant authz over models, adapters, and priority tiers; and the
critical isolation detail — **caches must be tenant-keyed**, because a shared-prefix cache hit
across tenants would leak one tenant's context into another's. PII handling rests on retention
minimization, **metadata-first logging** (never log raw prompts/completions by default), data
residency, and a no-training-without-consent policy. And the LLM-specific abuse vector isn't
volume — it's a few **maximally expensive** requests (max context, max output), so limiting
must be **token-cost-aware** with per-request cost caps and per-tenant cost circuit-breakers.

**Async messaging** keeps the hot path synchronous and shoves everything off-path onto a
queue. Metering rides **Kafka**, partitioned by tenant (ordered per-tenant aggregation; watch
hot partitions for whale tenants), with **at-least-once + idempotent consumer dedup =
effectively-once billing**, consumer lag as the pipeline SLI, and a dead-letter queue so a
poison event can't wedge a partition. Batch inference rides a low-priority queue to backfill
the diurnal troughs — a direct utilization win.

## 11. Evolution — MVP → 10× → 100×

The architecture described is the mature version; you would not build all of it on day one.

At **MVP**, strip to essentials: a stateless gateway, a simple router, and a single unified
GPU pool running vLLM with **continuous batching and PagedAttention** (not optional even at
MVP — they're the difference between viable and bankrupt unit economics), chunked prefill,
≥2 replicas per model, idempotency, and input moderation. Metering can start as plain logging
before Kafka. The MVP is complete as a product — just not yet efficient or huge.

At **10×**, traffic and cost are real, so you spend engineering to claw back GPU:
**disaggregated prefill/decode**, prefix caching with coalescing, **multi-LoRA** to collapse
the proliferating fine-tunes, load-aware cache-affinity routing, **predictive autoscaling**
with a warm buffer, Kafka metering, phase-level tracing, and the first eval gating on
rollouts. Same architecture, now squeezed for utilization.

At **100×**, the serving is solved and the hard problems migrate: **capacity planning** on a
quarterly horizon becomes central, **multi-region** becomes real (availability and data
residency), **heterogeneous-hardware routing** across the GPU classes in Figure 5 becomes a
serious cost lever, and the router itself may go hierarchical/regional. The architecture's
*shape* barely changes across three orders of magnitude — a stateless shell around a managed
GPU core with an off-path control plane — which is the sign the foundational decomposition
was right.

## 12. Key takeaways

1. **Everything is the throughput–latency–cost triangle**, and the triangle is one scarce
   resource — GPU memory and GPU time. You buy performance and reliability with spare silicon,
   which makes the cost dial unusually direct.
2. **KV-cache memory is the binding constraint** — it caps batch size, throughput, and cost.
   Continuous batching plus PagedAttention (roughly 2× effective throughput) are how you stop
   wasting it.
3. **Requests is the wrong unit; tokens is the right one** — and prefill (compute-bound) and
   decode (memory-bound) are different enough to justify disaggregation at scale.
4. **Heterogeneous GPUs are a cost lever** — match model size, phase, and cost-per-token to the
   cheapest hardware that hits the SLO, from L4s for small models to H100s for big tensor-parallel
   ones.
5. **Cold start is minutes**, so reliability and burst-headroom are bought with pre-warmed idle
   GPUs, and capacity is a quarterly *planning* problem before it's an autoscaling one.

## 13. Open questions

- What is the real, benchmarked **tokens/sec/GPU per model and per hardware class** — the
  number the entire fleet sizing rests on, and the thing most worth measuring before trusting
  any cost estimate?
- Where exactly does **disaggregation** start to pay — at what fleet size and KV-transfer cost
  does the interference win beat the operational complexity?
- How much can a **cost-aware, heterogeneous-hardware router** save in practice once it scores
  cost-to-serve across five GPU classes rather than routing on load alone?
- What's the most reliable way to catch **silent quality regression** from an upstream model
  change before it reaches everyone — the failure mode no infra metric will ever flag?

## References

1. W. Kwon et al., *Efficient Memory Management for Large Language Model Serving with
   PagedAttention* (vLLM), SOSP 2023 (arXiv:2309.06180).
2. T. Dao et al., *FlashAttention: Fast and Memory-Efficient Exact Attention with
   IO-Awareness*, NeurIPS 2022 (arXiv:2205.14135).
3. G.-I. Yu et al., *Orca: A Distributed Serving System for Transformer-Based Generative
   Models* (continuous batching), OSDI 2022.
4. P. Patel et al., *Splitwise: Efficient Generative LLM Inference Using Phase Splitting*
   (prefill/decode disaggregation), ISCA 2024 (arXiv:2311.18677).
5. A. Agrawal et al., *Taming Throughput-Latency Tradeoff in LLM Inference with Sarathi-Serve*
   (chunked prefill), OSDI 2024 (arXiv:2403.02310).
6. E. J. Hu et al., *LoRA: Low-Rank Adaptation of Large Language Models*, ICLR 2022
   (arXiv:2106.09685).
7. Y. Sheng et al., *S-LoRA: Serving Thousands of Concurrent LoRA Adapters*, 2023
   (arXiv:2311.03285).
8. A. Verma et al., *Large-scale Cluster Management at Google with Borg*, EuroSys 2015.
9. A. Vattani, F. Chierichetti, K. Lowenstein, *Optimal Probabilistic Cache Stampede
   Prevention*, VLDB 2015.
10. M. Mitzenmacher, *The Power of Two Choices in Randomized Load Balancing*, IEEE TPDS 2001.
11. NVIDIA documentation — H100, A100, L40S, L4, and RTX Pro 6000 datasheets; NCCL; Multi-Instance
    GPU (MIG); Triton Inference Server; and the Kubernetes GPU device plugin.

---

*Final entry in an ongoing architecture-study series. The companion pieces made one model fast
(kernel fusion), scaled many across a fabric (MoE networking), built everything around the model
(per-user RAG), and measured them all (benchmarking). This one is the platform that actually
runs them — where, at ten thousand GPUs and a nine-figure bill, almost every decision is the same
dial: how much do you pay, in money or complexity, to protect latency?*
