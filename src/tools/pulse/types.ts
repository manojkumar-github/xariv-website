export type Dtype = "fp16" | "fp8" | "int8" | "int4";

export interface PulseSpec {
  model_id: string;
  gpu_id: string;
  dtype: Dtype;
  concurrency: number; // requests served together (effective batch)
  num_requests: number; // how many requests to simulate
  dataset: string; // preset id or "custom"
  custom_text: string; // newline-separated prompts (custom dataset)
  custom_output_tokens: number; // avg generated tokens for custom dataset
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
  // latency distributions (ms)
  ttft_ms: MetricSummary;
  itl_ms: MetricSummary;
  tpot_ms: MetricSummary;
  e2e_ms: MetricSummary;
  // throughput
  throughput_tps: number; // aggregate output tokens / sec
  throughput_rps: number; // completed requests / sec
  telemetry: PulseTelemetry;
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
