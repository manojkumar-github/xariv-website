import type { GPU, Model } from "@/tools/types";
import { DTYPE_BYTES, KV_BYTES, GQA_FACTOR, MEM_SAFETY } from "./constants";

export interface CapacityPlan {
  weights_gb: number;
  kv_cache_gb: number;
  total_mem_gb: number;
  gpus_per_replica: number;
  replicas: number;
  gpus_needed: number;
  required_aggregate_tps: number;
}

function kvPerTokenBytes(model: Model): number {
  return 2 * model.num_layers * model.hidden_size * GQA_FACTOR * KV_BYTES;
}

export function capacity(
  gpu: GPU,
  model: Model,
  dtype: string,
  batch: number,
  contextLen: number,
  outputTokens: number,
  qps: number,
  perReplicaAggregateTps: number,
): CapacityPlan {
  const dbytes = DTYPE_BYTES[dtype];
  const weightsGb = model.total_params_b * dbytes;
  const seq = contextLen + outputTokens;
  const kvCacheGb = (batch * seq * kvPerTokenBytes(model)) / 1e9;
  const totalMemGb = (weightsGb + kvCacheGb) * MEM_SAFETY;
  const gpusPerReplica = Math.max(1, Math.ceil(totalMemGb / gpu.memory_gb));
  const requiredAggregateTps = qps * outputTokens;
  const replicas = Math.max(1, Math.ceil(requiredAggregateTps / Math.max(perReplicaAggregateTps, 1e-9)));

  return {
    weights_gb: Math.round(weightsGb * 10) / 10,
    kv_cache_gb: Math.round(kvCacheGb * 100) / 100,
    total_mem_gb: Math.round(totalMemGb * 10) / 10,
    gpus_per_replica: gpusPerReplica,
    replicas,
    gpus_needed: gpusPerReplica * replicas,
    required_aggregate_tps: Math.round(requiredAggregateTps * 10) / 10,
  };
}
