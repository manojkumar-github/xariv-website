
> **Architecture Study.** This is a hypothetical system study. The scale figures,
> SLAs, and design choices are illustrative and do not describe any specific employer
> or production system. The aim is to reason from first principles about a class of
> problem — large-scale, per-user, privacy-isolated retrieval — that recurs across
> consumer AI assistants.

## 1. Executive summary

We studied a hypothetical **AI inbox**: a consumer mail assistant where a user asks
*"summarize my travel receipts from last month"* and gets a grounded, cited answer
drawn from their own email, messages, and files. This is **per-user, private RAG**
(Retrieval-Augmented Generation) at the scale of **220M users** and **~2 billion
queries per day**, where generation itself is a **hosted LLM API call**, so the design
is everything *around* that call: ingestion, indexing, retrieval, ranking,
orchestration, grounding, and the isolation and compliance machinery.

Three findings reframe the whole system. First, despite "RAG" sounding read-heavy,
mail arrives constantly, so the system is **write-dominated** — ~310K embedding
writes/sec against ~23K average query QPS. Second, the **hosted-LLM token bill
(~$500M/year)** dwarfs every other line item, which makes *not calling the LLM* the
organizing principle of the read path. Third — and this is the spine of the design —
because retrieval is always scoped to a single user, **partitioning by `user_id`**
collapses an impossible global-search problem into a trivial per-user one, and
simultaneously delivers isolation, cost-tiering, and compliance-grade deletion. This
is the walkthrough.

## 2. Business context

The shape of the problem comes from a handful of locked-in requirements: per-user
private corpora (emails, messages, files); two freshness tiers (a nightly bulk
re-index plus near-real-time indexing of newly arrived content in
seconds-to-minutes); multimodal inputs (PDFs needing OCR, tables, images); a hosted
LLM; low hallucination tolerance with **mandatory citations**; **per-user isolation**;
hard cost discipline; and a full compliance envelope (encryption, PII handling, data
residency, audit logging).

One tension runs through everything: **per-user isolation, near-real-time freshness,
and cost optimization pull against each other.** Per-user indexes mean 220M tiny
corpora rather than one shared one; real-time freshness means a constant write stream;
cost optimization means avoiding both excess infrastructure and excess LLM calls.
Reconciling those three is the heart of the design.

## 3. Scale estimation — where intuition flips

Numbers first, because they change what kind of system this is.

With ~110M daily-active users and ~2B queries/day, average load is
2,000,000,000 ÷ 86,400 ≈ **~23K QPS**, peaking around **~70K**. That feels read-heavy
until you size the *write* path. If 220M users each receive ~40 emails/day (plus
messages and files), that's ~9B documents/day; at ~3 chunks each, ~27B chunks/day, or
**~310K embedding writes/sec** — an order of magnitude heavier than the read path.

![Read vs write throughput and the LLM cost headline](/images/rag-scale-flip.svg)
*Figure 1. The intuition flip: the ingestion/embedding pipeline, not query serving, is the volume bottleneck — and the hosted-LLM bill dominates the economics.*

Storage compounds it. At ~10K embedded chunks per user, that's 220M × 10K ≈ **2.2
trillion vectors**. A 768-dim fp32 vector is ~3KB; **int8 quantization** cuts it to
~768 bytes, taking the corpus from ~6.6 PB to **~1.7 PB** — which is why quantization
is load-bearing, not optional. Add raw chunk text and metadata for citations and you
land at multi-petabyte scale.

Then the headline. Each query ships ~10 retrieved chunks (~5K input tokens) to the
hosted LLM: 2B × 5K ≈ **10 trillion input tokens/day**. Even at ~$0.15 per million
tokens that's ~$1.5M/day, **~$500M+/year on input tokens alone**. That single number
is why caching and query-deflection aren't optimizations — they're architecture.
Deflecting even 30% of queries is ~$150M/year.

So the three pressures carried forward: **write-heavy ingestion, petabyte per-user
partitioning, and deflect-the-LLM cost discipline.**

## 4. Architecture overview — two systems sharing a storage layer

The cleanest framing is that this is *two systems* with a shared substrate: a
write/ingestion path running constantly in the background, and a read/query path that
fires when a user asks something. Because the system is write-dominated, the
architecture must make those paths **independent**, so the ingestion firehose can
never starve query latency.

![Two-system architecture sharing a user-partitioned storage layer](/images/rag-architecture.svg)
*Figure 2. A Kafka-decoupled write path keeps per-user indexes fresh; a cache-first read path does everything possible to answer without an LLM call. Both share a user-partitioned vector store and metadata store, governed by a small consistent control plane.*

On the **read path**, a request hits the API gateway (TLS, JWT auth, and per-user rate
limiting that doubles as budget protection), then an orchestrator that checks the
**semantic answer cache first** (deflect if hit), embeds the query and extracts
filters ("last month" → a timestamp range), retrieves user-scoped candidates,
re-ranks them with a cross-encoder, assembles a grounded prompt, calls the hosted LLM,
and streams back an answer with citations.

On the **write path**, source events flow through OAuth-scoped connectors into
**Kafka**, then parser/OCR workers, a chunker, a batched GPU **embedding service**, and
an **index writer** that performs idempotent upserts and emits a cache-invalidation
event. Kafka is load-bearing: it decouples "an email arrived" from "it got embedded
and indexed," absorbs bursts, enables replay, and lets the two freshness tiers ride
separate topics so a nightly bulk re-index never delays fresh mail.

The one-line story: **decoupling protects latency from the write firehose, cache-first
protects the budget, and user-scoped partitioning protects isolation.**

## 5. The reframing — `user_id` as the universal partition key

Here is the insight that makes the rest tractable.

![Per-user partitioning turns global ANN into a tiny per-user search](/images/rag-partitioning.svg)
*Figure 3. We never search 2.2 trillion vectors. Because retrieval is always scoped to one user, the real problem is ANN over one user's ~10K vectors — done 70,000 times a second for different users.*

2.2 trillion vectors is a frightening number we *never actually search*, because there
is no cross-user query — ever. So the question isn't "how do I run approximate nearest
neighbor (ANN) over 2.2T vectors," it's "how do I run ANN over **one user's ~10K
vectors**, 70K times a second." Searching 10K vectors is trivial.

Both extremes are traps. *One ANN index per user* (220M tiny HNSW graphs) dies on
fixed per-index overhead and lifecycle management. *One global index filtered by
`user_id`* is the classic filtered-ANN trap — the graph walk keeps surfacing other
users' vectors you discard, and isolation-by-filter is fragile. The answer is in the
middle: **shard by `user_id`, co-locate per user, search only within the user's
segment.** That single decision is simultaneously the performance story, the isolation
story, the cost story, and the compliance story.

## 6. Storage — polyglot persistence, tiering, and the CAP split

This isn't one database; it's four, each matched to an access pattern. Vectors go in a
specialized **ANN index**. Chunk metadata (text, source, timestamp, doc_id, user_id)
goes in a **NoSQL wide-column store** (Bigtable/Cassandra/DynamoDB-style), because the
access pattern is a single-partition scan keyed by `user_id` — write-dominated,
petabyte-scale, with no cross-user joins, exactly what SQL's transactions and joins
*don't* help. Raw documents go in **object storage**, fetched only for citation
display. And one small **SQL/consistent control plane** holds the
`user → shard → region` mapping, where strong consistency is cheap and essential.

**Sharding** uses consistent hashing on `user_id` across a few thousand shards (each
holding millions of users), with virtual nodes for even distribution. Consistent
hashing matters because the corpus only grows: adding a shard remaps ~1/N of users
instead of reshuffling petabytes. Per-user skew (a decade-long power user with millions
of chunks) averages out with millions of users per shard.

**Tiering is the core cost lever**, and it's only possible because each user's index is
a self-contained unit.

![Hot/cold tiering of per-user indexes and the RAM wall](/images/rag-tiering.svg)
*Figure 4. Active users' HNSW graphs stay hot in RAM; dormant users tier down to DiskANN/IVF on cheap storage with a small warmup cost. Keeping all 1.7 PB hot would mean renting petabytes of RAM — the binding constraint of the whole system.*

Deletes fall out naturally too: HNSW doesn't truly delete (it tombstones and degrades),
but rebuilding **one user's** tiny index to compact tombstones is cheap and routine —
so right-to-be-forgotten is structurally affordable, where compacting a global
trillion-vector index would be a nightmare.

On **CAP**, the split is deliberate: the **data plane** (vectors + metadata) is **AP** —
under a partition I serve slightly stale results rather than fail, which is in spec
because we already promised seconds-to-minutes freshness. The **control plane** is
**CP** — routing a user to the wrong shard could leak another user's data, so it's
never traded, but it's tiny and stable. A nice property falls out: because everything
routes by `user_id`, a user's reads and writes hit the same primary, giving
**read-your-own-writes** ("I just got an email, summarize it" works) even under global
eventual consistency.

On the **vector engine** itself, the honest answer is *measure, don't guess*. A managed
service like Pinecone is the right call at startup scale (namespaces map cleanly to
tenants) but its margin and its handling of hundreds of millions of tiny tenants strain
at this scale; OpenSearch gives native hybrid (vector + BM25 + filters) and
self-hosting control at real operational cost; and a tiered Vespa or custom
FAISS/DiskANN service is the likely end state — decided by benchmarking recall,
latency, and cost against real numbers.

## 7. The read path and its latency budget

Putting a budget on the read path reveals which optimizations actually matter:

| Stage | Approx. latency |
|---|---:|
| Gateway auth + rate-limit (local JWT verify) | ~5 ms |
| Semantic cache lookup | ~10 ms |
| Query embedding | ~30–50 ms |
| Retrieval (hot user index) | ~10 ms (+~50 ms cold warmup) |
| Re-ranking (cross-encoder over ~50 candidates) | ~40–60 ms |
| Prompt assembly | ~5 ms |
| **Hosted LLM to first token** | **~500 ms–1 s+** |

The lesson to say out loud: **the LLM call is ~70% of the budget and we don't control
it.** Shaving retrieval from 10 ms to 5 ms is theater. The only levers that matter are
(a) **hitting the cache** to skip the LLM entirely, and (b) **streaming tokens** the
instant the LLM emits them. So the external query API is a `POST` that opens an
**SSE** (Server-Sent Events) stream — unidirectional, rides plain HTTP through the CDN,
auto-reconnects — and it sends **citations first**, before generation, so sources
render instantly and grounding is visible:

```
event: sources
data: {"citations":[{"doc_id":"mail_8842","title":"Receipt — United","date":"2026-05-12"}]}
event: token
data: {"delta":"You spent $1,240 across 3 trips "}
event: done
data: {"request_id":"req_77a1","cache":"miss"}
```

Internally, services talk **gRPC** (compact protobuf over HTTP/2) at 70K QPS, and
`user_id` is a **required field** on the retrieval contract — isolation living in the
type system, not a comment.

## 8. Caching — the cost engine, and why invalidation is the hard part

The semantic answer cache is simultaneously the biggest cost lever and the biggest
correctness risk: every other cache returns exactly what you asked for; this one
returns an answer to a *similar* question. Lookup is therefore **vector similarity**,
not exact match — which means the answer cache is itself a tiny per-user RAG, sharded
by `user_id`, inheriting every isolation requirement. The governing knob is the
**similarity threshold**: loosen it and hit-rate (and savings) climb but you risk
serving a confidently-wrong cached answer; given low hallucination tolerance, **bias
tight** and treat it as something tuned against a quality eval, not guessed.

Invalidation is where naive caching breaks. A pure TTL short enough to honor a
seconds-to-minutes freshness SLA collapses the hit-rate to nothing, so we use the
**event-driven** loop the architecture already wired in — but with the right
granularity.

![Relevance-scoped, event-driven cache invalidation](/images/rag-cache-invalidation.svg)
*Figure 5. Flushing all of a user's cache on any change punishes exactly the active users who query most. Instead, a change invalidates only cached answers whose grounding overlaps it (by document type and time bucket), keeping unrelated answers alive.*

Each cached answer is tagged with what it was grounded on; a new receipt invalidates
receipt-summaries but leaves "what did my boss say about the Q3 deadline" untouched.
Deletes deliberately **over-invalidate** — surfacing legally-deleted content is worse
than a cache miss. A TTL with jitter stays as a backstop for anything the event system
misses. And critically, the cache is **not a SPOF**: if Redis dies, every request
simply misses and falls through to the real pipeline — the bill rises and latency
grows, but correctness and availability don't change. That property is what licenses
running it aggressively.

## 9. Ingestion and messaging — Kafka, ordering, and idempotency

The single most important decision in the messaging layer is **ordering**, because
getting it wrong produces silent corruption no amount of replication fixes.

![Kafka partition ordering and the ghost-document compliance bug](/images/rag-ordering.svg)
*Figure 6. A document's create → update → delete must stay ordered. Split across partitions, a delete can be processed before the create, leaving a "ghost" — a deleted email still retrievable, which is a compliance violation, not a cosmetic bug.*

Kafka only guarantees order within a partition, so the partition key must keep a single
document's events together. Partitioning by `user_id` over-orders (and concentrates a
heavy user's load on one partition); partitioning by **`hash(user_id, doc_id)`** gives
ordering at exactly the granularity correctness needs — per document — while spreading
load. As a backstop, every event carries a **monotonic version**, and the writer
**rejects a write older than what's stored**, so even a redelivered, out-of-order
update can't clobber a newer delete.

This composes with the idempotency story. Kafka is at-least-once, so duplicates happen;
rather than chase expensive exactly-once delivery, each document carries a
deterministic dedup key — `hash(user_id, source_message_id)` — and the writer
**upserts** on it. Reprocessing is a no-op. That one decision yields three properties:
dedup, **safe retries**, and **safe replay** — rewinding a Kafka offset to rebuild a
corrupted index reproduces the identical end state. Topics are split by freshness tier
(real-time vs nightly bulk, separate consumer groups) and by stage, and poison messages
are quarantined to a **dead-letter queue** after bounded retries so one bad scanned PDF
can't head-of-line-block a partition.

## 10. Failure modes worth designing for

Four failure modes dominate. **Cache stampede** — many identical queries missing at
once (e.g., an 8am "summarize my day") — is defended with request coalescing
(single-flight), probabilistic early expiration, and jittered TTLs, plus a circuit
breaker as backstop. **Hot users / noisy neighbors** — the partition key that minimizes
isolation blast-radius *concentrates* load blast-radius on one shard — is handled by
the per-user rate limiter, promoting whales to dedicated resources, and per-shard load
shedding (batch before interactive). **Consumer lag** on the ingestion firehose is the
SLA killer; the bottleneck is the embedding GPU step, so we batch aggressively (with a
max-batch-timeout), autoscale on **lag, not CPU**, and isolate tiers by topic.
**Retry storms** against the hosted LLM are tamed with exponential backoff + jitter, a
**retry budget** (caps aggregate retries, not just spacing), and a circuit breaker that
fails fast to let the upstream recover.

## 11. Security — isolation enforced, not assumed

The catastrophic failure here isn't downtime; it's one user seeing another's mail. So
isolation is enforced in **four independent layers**, defense in depth, so no single
bug leaks data: (1) at the **edge**, the authoritative `user_id` comes from the signed
JWT, never a request parameter (killing IDOR); (2) in **service contracts**, `user_id`
is a required gRPC field — "retrieve globally" is unrepresentable; (3) in the **data
layer**, physical per-user partitions mean another user's data *isn't present to leak*
— isolation is structural, not a `WHERE` clause; (4) in the **cache**, keys are
namespaced per user.

Beyond isolation: connectors authenticate to mail providers via **OAuth** with
least-privilege scopes, and those refresh tokens live in a KMS-backed vault (a leaked
one is standing access to a real mailbox). Encryption is TLS in transit (including
**mTLS** internally — zero trust, not "the VPC is safe") and at rest with **per-region
KMS keys** that reinforce residency; **per-tenant keys** enable **crypto-shredding** —
destroy the key to render a user's data unrecoverable instantly, a clean
right-to-be-forgotten primitive. The uncomfortable, honestly-named risk is **PII
egress to the hosted LLM** on every query: it demands a zero-retention provider tier,
and if compliance tightened, that single concern could force self-hosting — the most
contingent assumption in the design. Audit logging (who-queried-what, append-only,
tamper-evident, residency-respecting) rides its own pipeline so it never becomes a
latency tax.

## 12. Observability — the hard part is semantic, not mechanical

This system can be perfectly healthy by every mechanical metric — fast, 200s, low CPU —
and still be **confidently hallucinating**. The failure modes that matter most are
semantic and invisible to a standard dashboard.

The mechanical layer is table stakes: percentile latency decomposed by stage (to
confirm the LLM really is ~70%), and on ingestion, **time-to-searchable** (measured
end to end, not inferred from queue depth) as the freshness SLI. Two metrics are
first-class for *this* system: **cache hit-rate** (a 5-point drop is millions of
dollars, so it's paged like an outage) and **LLM cost-per-query** (a budget burn-rate
alert when spend tracks over forecast). Async tracing across the multi-hop, minutes-long
Kafka pipeline uses a **correlation ID in the event envelope**, not classic
request-trace propagation — answering "the email from 10 minutes ago isn't searchable;
where is it stuck?" Logs deliberately exclude PII payloads (IDs and metadata only).

Detecting **quality regression** needs an explicit semantic layer: cheap **proxy
signals** on all traffic (retrieval similarity distribution, "no good results" rate,
citation coverage), **sampled deep evaluation** (LLM-as-judge for groundedness, biased
toward risky segments, with human review), and **guardrail-trip rate** as a real-time
signal. The discipline that makes it actionable is **canary/shadow evaluation at
deploy boundaries** — including catching the genuinely scary case where the hosted
model silently changes underneath you. The honest limit: quality observability here is
**statistical and proxied**, not a per-query certainty, because exact semantic checking
at billions of queries isn't affordable.

## 13. Evolution — most of this is overkill on day one

The art is knowing which decisions to make early because they're expensive to retrofit,
and which to defer.

At **MVP** (thousands of users, proving the product is useful), collapse almost
everything: a single managed vector DB (this is exactly where Pinecone's per-namespace
isolation shines), synchronous-ish ingestion, an exact-match cache, single region,
direct LLM calls. The two things to get right from day one are the **data-model
invariants** — per-user partitioning and the idempotent write key — because retrofitting
isolation onto a shared index, or idempotency after corrupting data, is a rewrite.

At **10x**, the managed abstractions crack on cost first: introduce **hot/cold tiering**
(the RAM math now hurts), the **semantic answer cache** (the LLM bill now justifies the
invalidation machinery), real **Kafka with two freshness tiers** (lag is now a real SLA
risk), and split the stateless services.

At **100x** (the 220M-user target), move to the self-managed tiered vector store
(managed margin is unaffordable at trillions of vectors), make **multi-region
residency routing** mandatory, and activate the full reliability and compliance
apparatus — quorum, consensus-backed leader election, in-jurisdiction DR, per-tenant
keys, the immutable audit pipeline, and continuous groundedness evaluation. The
throughline: each deferred decision activates when its pain crosses the complexity
threshold — **cost pressures first, scale next, compliance-and-reliability last** — and
the data-model invariant is the one thing held constant throughout.

## 14. Key takeaways

1. **It's write-dominated, not read-heavy** — the embedding pipeline (~310K writes/sec)
   is the volume bottleneck, and the embedding GPU fleet grows with ingestion regardless
   of query value.
2. **The hosted-LLM bill (~$500M/yr) dominates everything** — so the read path is built
   to *not call the LLM*, and cache hit-rate is the load-bearing business metric.
3. **Partition by `user_id`** turns an impossible global-ANN problem into a trivial
   per-user one, and delivers isolation, cost-tiering, and cheap compliance deletes in
   the same stroke.
4. **The hot-tier RAM wall is the scariest scaling limit** — everything rests on the
   active working set staying small; quantization and tiering are load-bearing.
5. **Reliability falls out of structure** — stateless services, idempotent writes, and a
   non-SPOF cache mean much of the fault tolerance was bought by decisions made for other
   reasons; at-least-once + idempotent upserts beats chasing exactly-once.

## 15. Open questions

- What is the real, empirical **cache hit-rate and false-hit-rate**, against a quality
  eval — the number every cost estimate hangs off?
- How large does the **hot working set** actually get under feature changes that drive
  more simultaneous activity — and when does the RAM wall bind?
- Can **lazy/deferred embedding** for low-signal content meaningfully cut the
  ingestion GPU bill without hurting perceived freshness?
- Could a credible **self-hosted model** flip the most contingent assumption, trading
  the $500M token bill and PII-egress risk for GPU-serving complexity?

## References

1. P. Lewis et al., *Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks*,
   NeurIPS 2020 (arXiv:2005.11401).
2. V. Karpukhin et al., *Dense Passage Retrieval for Open-Domain Question Answering*,
   EMNLP 2020 (arXiv:2004.04906).
3. Y. Malkov, D. Yashunin, *Efficient and Robust Approximate Nearest Neighbor Search
   Using Hierarchical Navigable Small World Graphs* (HNSW), 2016 (arXiv:1603.09320).
4. S. Subramanya et al., *DiskANN: Fast Accurate Billion-point Nearest Neighbor Search
   on a Single Node*, NeurIPS 2019.
5. J. Johnson, M. Douze, H. Jégou, *Billion-scale Similarity Search with GPUs* (FAISS),
   2017 (arXiv:1702.08734).
6. H. Jégou, M. Douze, C. Schmid, *Product Quantization for Nearest Neighbor Search*,
   IEEE TPAMI, 2011.
7. R. Guo et al., *Accelerating Large-Scale Inference with Anisotropic Vector
   Quantization* (ScaNN), ICML 2020 (arXiv:1908.10396).
8. G. DeCandia et al., *Dynamo: Amazon's Highly Available Key-value Store*, SOSP 2007.
9. D. Karger et al., *Consistent Hashing and Random Trees*, STOC 1997.
10. S. Gilbert, N. Lynch, *Brewer's Conjecture and the Feasibility of Consistent,
    Available, Partition-Tolerant Web Services* (CAP), 2002.
11. D. Ongaro, J. Ousterhout, *In Search of an Understandable Consensus Algorithm*
    (Raft), USENIX ATC 2014.
12. A. Vattani, F. Chierichetti, K. Lowenstein, *Optimal Probabilistic Cache Stampede
    Prevention*, VLDB 2015.
13. Apache Kafka, OpenSearch k-NN, Vespa, and Pinecone — official documentation.

---

*Part of an ongoing architecture-study series. Where the companion pieces asked how to
make one model fast (kernel fusion) and how to scale many across a fabric (MoE
networking), this one is about everything around the model: when the LLM is a hosted
call, the system is the retrieval, the isolation, and the economics.*
