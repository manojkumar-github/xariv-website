import type { GPU } from "@/tools/types";
import { HOURS_PER_MONTH, SECONDS_PER_MONTH } from "./constants";

export interface CostModel {
  monthly_usd: number;
  cost_per_million_requests_usd: number;
  power_kw: number;
}

export interface BottleneckResult {
  kind: string;
  detail: string;
  headroom_pct: number;
  util_mem_capacity: number;
  util_mem_bandwidth: number;
  util_compute: number;
  util_network: number;
}

export function cost(gpu: GPU, gpusNeeded: number, qps: number): CostModel {
  const monthly = gpusNeeded * gpu.hourly_usd * HOURS_PER_MONTH;
  const requestsPerMonth = qps * SECONDS_PER_MONTH;
  const perMillion = monthly / Math.max(requestsPerMonth / 1e6, 1e-9);
  return {
    monthly_usd: Math.round(monthly),
    cost_per_million_requests_usd: Math.round(perMillion * 100) / 100,
    power_kw: Math.round((gpusNeeded * gpu.tdp_watts) / 1000 * 10) / 10,
  };
}

export function classify(
  totalMemGb: number,
  gpuMemGb: number,
  gpusPerReplica: number,
  tMemTok: number,
  tComputeTok: number,
  tNetTok: number,
): BottleneckResult {
  const bindingOnchip = Math.max(tMemTok, tComputeTok);
  const critical = bindingOnchip + tNetTok;

  const utilMemCapacity = Math.min(100, (100 * totalMemGb) / (gpusPerReplica * gpuMemGb));
  const utilMemBandwidth = (100 * tMemTok) / bindingOnchip;
  const utilCompute = (100 * tComputeTok) / bindingOnchip;
  const utilNetwork = critical ? (100 * tNetTok) / critical : 0;

  let kind: string;
  let detail: string;
  let headroom: number;

  if (utilMemCapacity > 95) {
    kind = "mem_capacity";
    detail = "HBM capacity is the binding constraint — weights + KV cache nearly fill the GPUs.";
    headroom = Math.round((100 - utilMemCapacity) * 10) / 10;
  } else if (utilNetwork > 50 && gpusPerReplica > 1) {
    kind = "network";
    detail = "Collective communication (all-to-all / all-reduce) dominates the per-token critical path.";
    headroom = Math.round((100 - utilNetwork) * 10) / 10;
  } else if (tMemTok >= tComputeTok) {
    kind = "mem_bandwidth";
    detail = "Decode is memory-bandwidth bound — the GPU reads weights faster than it computes.";
    headroom = Math.round((100 - utilCompute) * 10) / 10;
  } else {
    kind = "compute";
    detail = "Workload is compute-bound — batching has pushed it toward the FLOPs roof.";
    headroom = Math.round((100 - utilMemBandwidth) * 10) / 10;
  }

  return {
    kind,
    detail,
    headroom_pct: headroom,
    util_mem_capacity: Math.round(utilMemCapacity * 10) / 10,
    util_mem_bandwidth: Math.round(utilMemBandwidth * 10) / 10,
    util_compute: Math.round(utilCompute * 10) / 10,
    util_network: Math.round(utilNetwork * 10) / 10,
  };
}
