Autoregressive LLM serving has two distinct performance regimes that most capacity models conflate:

**Prefill** processes the entire prompt in one forward pass. It is compute-bound — FLOPs scale with `2 × active_params × context_length`.

**Decode** generates one token at a time per request. At low batch, it reads the full weight set to emit a single token — memory-bandwidth bound, not compute bound.

## Why this matters for sizing

A GPU that looks busy on SM utilization may still be memory-bandwidth starved during decode. Conversely, a workload pushed to high batch may cross into the compute-bound regime — but at the cost of tail latency.

Capacity planning must model both regimes separately, then take the binding constraint.

## Practical implication

- **TTFT** is dominated by prefill (compute).
- **TPOT / ITL** is dominated by decode (memory bandwidth at low batch).
- Increasing batch size amortizes weight reads but raises per-request latency.

The roofline model for inference is not a single number — it is a regime map.
