export function recommend(
  bottleneckKind: string,
  meetsSlo: boolean,
  dtype: string,
  _gpusPerReplica: number,
  isMoe: boolean,
  monthlyUsd: number,
): string[] {
  const recs: string[] = [];

  if (bottleneckKind === "mem_capacity") {
    recs.push(
      `Quantize weights below ${dtype} (e.g. FP8 or INT4) to cut HBM footprint and reduce GPUs per replica.`,
      "Adopt a higher-capacity GPU (H200 141GB, B200/MI300X 192GB) to fit the model in fewer devices.",
      "Reduce batch size or context length to shrink the KV cache, or enable KV-cache quantization.",
    );
  } else if (bottleneckKind === "mem_bandwidth") {
    recs.push(
      "Increase effective batch size (continuous batching) to amortize weight reads and raise aggregate throughput.",
      "Quantize weights to FP8/INT4 — fewer bytes moved per token directly relieves the bandwidth wall.",
      "Move to a higher-bandwidth GPU (B200 ~8 TB/s HBM3e) — decode throughput scales with memory bandwidth.",
    );
  } else if (bottleneckKind === "compute") {
    recs.push(
      "Workload is near the compute roof — consider speculative decoding to raise tokens/sec per FLOP.",
      "If latency-bound, reduce batch size; if throughput-bound, a higher-FLOPs GPU helps.",
      "Ensure kernels are fused (TensorRT-LLM, FlashAttention) and CUDA Graphs eliminate launch overhead.",
    );
  } else if (bottleneckKind === "network") {
    recs.push(
      "Shrink GPUs-per-replica so a replica fits inside one NVLink/NVSwitch domain (avoid the inter-node fabric).",
      "Use hierarchical all-to-all (NVLink gather → single IB exchange → scatter) to collapse small messages.",
      "Adopt a rail-optimized fabric and enable adaptive routing to spread converging flows.",
    );
    if (isMoe) {
      recs.push("Replicate hot experts and balance across replicas to break per-expert incast.");
    }
  }

  if (!meetsSlo) {
    recs.push("Latency SLO is at risk: lower batch size, shorten context, or split prefill (chunked prefill) to protect TTFT.");
  }

  if (monthlyUsd > 1_000_000) {
    recs.push("Spend exceeds $1M/mo — evaluate reserved/committed-use pricing and right-sizing replicas to actual peak.");
  }

  return recs;
}
