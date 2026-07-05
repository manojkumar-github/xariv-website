// Shared types for Lens and Pulse engines

export interface EcoMetrics {
  power: number;
  power_streaming: number;
  energy: number;
  co2: number;
  carbon: number;
  temperature: number;
}

export interface GPU {
  id: string;
  name: string;
  vendor: string;
  memory_gb: number;
  mem_bw_tbs: number;
  fp16_tflops: number;
  fp8_tflops: number;
  nvlink_gbs: number;
  tdp_watts: number;
  hourly_usd: number;
}

export interface Model {
  id: string;
  name: string;
  family: string;
  total_params_b: number;
  active_params_b: number;
  num_layers: number;
  hidden_size: number;
  is_moe: boolean;
  top_k: number;
}

export interface Network {
  id: string;
  name: string;
  per_gpu_gbs: number;
  scope: string;
}

export interface Catalog {
  gpus: GPU[];
  models: Model[];
  networks: Network[];
}

export type Dtype = "fp16" | "fp8" | "int8" | "int4";

export interface WorkloadSpec {
  model_id: string;
  gpu_id: string;
  network_id: string;
  dtype: Dtype;
  context_length: number;
  output_tokens: number;
  qps: number;
  batch_size: number;
  p99_target_ms: number;
}

export interface DecisionReport {
  gpus_needed: number;
  gpus_per_replica: number;
  replicas: number;
  ttft_ms: number;
  decode_tps_per_request: number;
  aggregate_tps: number;
  meets_slo: boolean;
  monthly_cost_usd: number;
  cost_per_million_requests_usd: number;
  power_kw: number;
  eco: EcoMetrics;
  bottleneck: { kind: string; detail: string; headroom_pct: number };
  utilization: {
    mem_capacity_pct: number;
    mem_bandwidth_pct: number;
    compute_pct: number;
    network_pct: number;
  };
  recommendations: string[];
  assumptions: string[];
}

export interface PulseSpec {
  model_id: string;
  gpu_id: string;
  dtype: Dtype;
  concurrency: number;
  num_requests: number;
  dataset: string;
  custom_text: string;
  custom_output_tokens: number;
}

export interface MetricSummary {
  p50: number;
  p90: number;
  p99: number;
  mean: number;
}

export interface PulseTelemetry {
  regime: "memory-bound" | "compute-bound";
  sm_util_pct: number;
  mem_used_gb: number;
  mem_capacity_gb: number;
  mem_util_pct: number;
  mem_bw_util_pct: number;
  power_w: number;
  tdp_w: number;
  temp_c: number;
  gpus_needed: number;
}

export interface PulseReport {
  dataset_name: string;
  samples: number;
  prompt_tokens_avg: number;
  output_tokens_avg: number;
  total_output_tokens: number;
  ttft_ms: MetricSummary;
  itl_ms: MetricSummary;
  tpot_ms: MetricSummary;
  e2e_ms: MetricSummary;
  throughput_tps: number;
  throughput_rps: number;
  telemetry: PulseTelemetry;
  eco: EcoMetrics;
  notes: string[];
}

export interface DatasetPreset {
  id: string;
  name: string;
  source: string;
  prompt_mean: number;
  prompt_std: number;
  output_mean: number;
  output_std: number;
  blurb: string;
}
