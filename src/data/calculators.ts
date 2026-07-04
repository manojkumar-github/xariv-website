export type CalculatorTier = 1 | 2 | 3 | 4;

export interface CalculatorMeta {
  slug: string;
  name: string;
  description: string;
  tier: CalculatorTier;
  relatedStudy?: string;
  relatedProduct?: "/lens" | "/pulse";
}

export const calculators: CalculatorMeta[] = [
  // Tier 1
  { slug: "kv-cache", name: "KV Cache Calculator", description: "Estimate KV cache memory from model, context, batch, and precision.", tier: 1, relatedStudy: "kernel-fusion-llm-inference" },
  { slug: "gpu-memory", name: "GPU Memory Calculator", description: "Break down weights, KV cache, activations, and total HBM required.", tier: 1 },
  { slug: "gpu-count", name: "GPU Count Estimator", description: "Estimate GPUs needed for a target QPS, prompt, and output length.", tier: 1, relatedProduct: "/lens" },
  { slug: "cost", name: "Cost Estimator", description: "Daily, monthly, and annual GPU spend by type and utilization.", tier: 1 },
  { slug: "tokens-per-sec", name: "Tokens/sec Estimator", description: "Theoretical decode throughput from roofline model.", tier: 1, relatedStudy: "kernel-fusion-llm-inference" },
  // Tier 2
  { slug: "context-memory", name: "Context Window Memory", description: "Memory delta when scaling context from one length to another.", tier: 2 },
  { slug: "moe-expert", name: "MoE Expert Calculator", description: "Active vs total parameters, FLOPs, and routing overhead.", tier: 2, relatedStudy: "networking-moe-inference" },
  { slug: "tensor-parallel", name: "Tensor Parallel Planner", description: "Suggest TP/PP/EP split for a model on available GPUs.", tier: 2 },
  { slug: "nccl-bandwidth", name: "NCCL Bandwidth Estimator", description: "Estimated collective communication time per token.", tier: 2 },
  { slug: "network-bottleneck", name: "Network Bottleneck Estimator", description: "Whether MoE collectives dominate the critical path.", tier: 2, relatedStudy: "networking-moe-inference", relatedProduct: "/pulse" },
  // Tier 3
  { slug: "ttft", name: "TTFT Estimator", description: "Time to first token from prefill roofline.", tier: 3, relatedProduct: "/pulse" },
  { slug: "continuous-batching", name: "Continuous Batching Simulator", description: "How batch size trades latency for throughput.", tier: 3 },
  { slug: "quantization", name: "Quantization Savings", description: "Compare memory and throughput across precisions.", tier: 3 },
  { slug: "energy", name: "Energy & Power Calculator", description: "kWh, power cost, and rough CO₂ from GPU utilization.", tier: 3 },
  { slug: "cost-per-user", name: "Inference Cost per User", description: "Infrastructure cost amortized across daily active users.", tier: 3 },
  // Tier 4
  { slug: "readiness", name: "Infrastructure Readiness Score", description: "Quick scorecard for deployment configuration gaps.", tier: 4 },
  { slug: "bottleneck", name: "Bottleneck Predictor", description: "Predict whether workload is compute-, memory-, or network-bound.", tier: 4, relatedProduct: "/lens" },
  { slug: "parallelism-advisor", name: "Parallelism Advisor", description: "Recommend TP, PP, EP, and DP strategies.", tier: 4 },
  { slug: "architecture-advisor", name: "Inference Architecture Advisor", description: "Suggest serving topology for your workload shape.", tier: 4 },
  { slug: "model-recommendation", name: "Model Recommendation", description: "Shortlist models by latency, cost, and context constraints.", tier: 4 },
];

export function getCalculator(slug: string): CalculatorMeta | undefined {
  return calculators.find((c) => c.slug === slug);
}

export const tierLabels: Record<CalculatorTier, string> = {
  1: "Essential",
  2: "Advanced",
  3: "Operations",
  4: "XARIV Intelligence",
};
