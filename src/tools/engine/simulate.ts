import type { DecisionReport, WorkloadSpec } from "@/tools/types";
import { GPUS, MODELS, NETWORKS } from "./catalog";
import { performance } from "./performance";
import { capacity } from "./capacity";
import { networkModel } from "./network";
import { cost, classify } from "./cost";
import { recommend } from "./recommend";
import { computeEcoMetrics } from "./eco";

export function runSimulation(spec: WorkloadSpec): DecisionReport {
  const gpu = GPUS[spec.gpu_id];
  const model = MODELS[spec.model_id];
  const net = NETWORKS[spec.network_id];
  if (!gpu || !model || !net) {
    throw new Error("Unknown model, GPU, or network selection.");
  }

  const dtype = spec.dtype;

  const perf = performance(gpu, model, dtype, spec.batch_size, spec.context_length);

  const cap = capacity(
    gpu, model, dtype, spec.batch_size,
    spec.context_length, spec.output_tokens,
    spec.qps, perf.aggregate_tps_per_replica,
  );

  const tOnchipTok = Math.max(perf.t_mem_tok, perf.t_compute_tok);
  const netm = networkModel(model, dtype, net, cap.gpus_per_replica, tOnchipTok);

  const costm = cost(gpu, cap.gpus_needed, spec.qps);

  const bn = classify(
    cap.total_mem_gb, gpu.memory_gb, cap.gpus_per_replica,
    perf.t_mem_tok, perf.t_compute_tok, netm.t_net_tok,
  );

  const decodeTps = perf.decode_tps_per_request;
  const perTokenTotal = 1.0 / decodeTps + netm.t_net_tok;
  const requestLatencyMs = perf.ttft_ms + spec.output_tokens * perTokenTotal * 1e3;
  const meetsSlo = spec.p99_target_ms == null || requestLatencyMs <= spec.p99_target_ms;

  const recs = recommend(bn.kind, meetsSlo, dtype, cap.gpus_per_replica, model.is_moe, costm.monthly_usd);

  const utilPct = Math.max(
    bn.util_mem_bandwidth,
    bn.util_compute,
    bn.util_network,
    bn.util_mem_capacity * 0.6,
  );
  const outputTokensPerDay = spec.qps * spec.output_tokens * 86400;
  const eco = computeEcoMetrics({
    gpu,
    gpuCount: cap.gpus_needed,
    utilPct,
    outputTokensPerDay,
  });

  const assumptions = [
    `Memory-bandwidth utilization (MBU) ${Math.round(0.7 * 100)}%, model-FLOPs utilization (MFU) ${Math.round(0.4 * 100)}%.`,
    `All ${model.total_params_b}B weights resident; KV cache approximated with GQA factor 0.25.`,
    `GPU price ${gpu.hourly_usd.toFixed(2)} USD/hr on-demand (configurable); 730 hrs/month.`,
    `Eco: ${eco.co2} kg CO₂/day at ${eco.power} kW average (${eco.carbon} kg CO₂ / 1M output tokens).`,
    "Estimates are first-order roofline approximations, not a substitute for a live benchmark.",
  ];

  return {
    gpus_needed: cap.gpus_needed,
    gpus_per_replica: cap.gpus_per_replica,
    replicas: cap.replicas,
    ttft_ms: Math.round(perf.ttft_ms * 10) / 10,
    decode_tps_per_request: Math.round(decodeTps * 10) / 10,
    aggregate_tps: Math.round(perf.aggregate_tps_per_replica * cap.replicas * 10) / 10,
    meets_slo: meetsSlo,
    monthly_cost_usd: costm.monthly_usd,
    cost_per_million_requests_usd: costm.cost_per_million_requests_usd,
    power_kw: costm.power_kw,
    eco,
    bottleneck: { kind: bn.kind, detail: bn.detail, headroom_pct: bn.headroom_pct },
    utilization: {
      mem_capacity_pct: bn.util_mem_capacity,
      mem_bandwidth_pct: bn.util_mem_bandwidth,
      compute_pct: bn.util_compute,
      network_pct: bn.util_network,
    },
    recommendations: recs,
    assumptions,
  };
}
