import type { GPU, Model } from "@/tools/types";
import { DTYPE_BYTES, MBU, MFU, FIXED_TTFT_MS } from "./constants";

export interface PerfMetrics {
  t_mem_tok: number;
  t_compute_tok: number;
  decode_tps_per_request: number;
  aggregate_tps_per_replica: number;
  ttft_ms: number;
  memory_bound: boolean;
}

function peakFlops(gpu: GPU, dtype: string): number {
  const tflops = ["fp8", "int8", "int4"].includes(dtype) ? gpu.fp8_tflops : gpu.fp16_tflops;
  return tflops * 1e12;
}

export function performance(
  gpu: GPU,
  model: Model,
  dtype: string,
  batch: number,
  contextLen: number,
): PerfMetrics {
  const dbytes = DTYPE_BYTES[dtype];
  const activeParams = model.active_params_b * 1e9;
  const bw = gpu.mem_bw_tbs * 1e12;
  const flops = peakFlops(gpu, dtype);

  const weightBytes = activeParams * dbytes;
  const tStepMem = weightBytes / (bw * MBU);
  const tMemTok = tStepMem / batch;

  const tStepCompute = (2 * activeParams * batch) / (flops * MFU);
  const tComputeTok = tStepCompute / batch;

  const tStep = Math.max(tStepMem, tStepCompute);
  const memoryBound = tStepMem >= tStepCompute;

  const aggregateTps = batch / tStep;
  const perRequestTps = 1.0 / Math.max(tMemTok, tComputeTok);

  const prefillFlops = 2 * activeParams * contextLen;
  const ttftMs = (prefillFlops / (flops * MFU)) * 1e3 + FIXED_TTFT_MS;

  return {
    t_mem_tok: tMemTok,
    t_compute_tok: tComputeTok,
    decode_tps_per_request: perRequestTps,
    aggregate_tps_per_replica: aggregateTps,
    ttft_ms: ttftMs,
    memory_bound: memoryBound,
  };
}
