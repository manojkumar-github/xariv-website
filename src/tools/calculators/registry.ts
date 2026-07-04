import type { ComponentType } from "react";
import type { CalculatorMeta } from "@/data/calculators";
import {
  KvCacheCalc,
  GpuMemoryCalc,
  GpuCountCalc,
  CostCalc,
  TpsCalc,
  ContextMemoryCalc,
  MoeExpertCalc,
  TensorParallelCalc,
  NcclBandwidthCalc,
  NetworkBottleneckCalc,
  TtftCalc,
  ContinuousBatchingCalc,
  QuantizationCalc,
  EnergyCalc,
  CostPerUserCalc,
  ReadinessCalc,
  BottleneckCalc,
  ParallelismAdvisorCalc,
  ArchitectureAdvisorCalc,
  ModelRecommendationCalc,
} from "./views";

type CalcComponent = ComponentType<{ meta: CalculatorMeta }>;

export const calculatorViews: Record<string, CalcComponent> = {
  "kv-cache": KvCacheCalc,
  "gpu-memory": GpuMemoryCalc,
  "gpu-count": GpuCountCalc,
  cost: CostCalc,
  "tokens-per-sec": TpsCalc,
  "context-memory": ContextMemoryCalc,
  "moe-expert": MoeExpertCalc,
  "tensor-parallel": TensorParallelCalc,
  "nccl-bandwidth": NcclBandwidthCalc,
  "network-bottleneck": NetworkBottleneckCalc,
  ttft: TtftCalc,
  "continuous-batching": ContinuousBatchingCalc,
  quantization: QuantizationCalc,
  energy: EnergyCalc,
  "cost-per-user": CostPerUserCalc,
  readiness: ReadinessCalc,
  bottleneck: BottleneckCalc,
  "parallelism-advisor": ParallelismAdvisorCalc,
  "architecture-advisor": ArchitectureAdvisorCalc,
  "model-recommendation": ModelRecommendationCalc,
};
