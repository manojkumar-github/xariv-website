import { GPUS, MODELS } from "@/tools/engine/catalog";
import {
  DTYPE_BYTES,
  GQA_FACTOR,
  KV_BYTES,
  MBU,
  MFU,
  MEM_SAFETY,
  HOURS_PER_MONTH,
} from "@/tools/engine/constants";
import type { Dtype } from "@/tools/types";

export function kvPerTokenBytes(layers: number, hidden: number): number {
  return 2 * layers * hidden * GQA_FACTOR * KV_BYTES;
}

export function kvCacheGb(
  batch: number,
  seqLen: number,
  layers: number,
  hidden: number,
): number {
  return (batch * seqLen * kvPerTokenBytes(layers, hidden)) / 1e9;
}

export function weightsGb(paramsB: number, dtype: Dtype): number {
  return paramsB * DTYPE_BYTES[dtype];
}

export function peakFlops(gpuId: string, dtype: Dtype): number {
  const gpu = GPUS[gpuId];
  if (!gpu) return 0;
  const tflops = ["fp8", "int8", "int4"].includes(dtype) ? gpu.fp8_tflops : gpu.fp16_tflops;
  return tflops * 1e12;
}

/** Roofline decode: aggregate tokens/sec at given batch. */
export function estimateAggregateTps(
  modelId: string,
  gpuId: string,
  dtype: Dtype,
  batch: number,
): number {
  const model = MODELS[modelId];
  const gpu = GPUS[gpuId];
  if (!model || !gpu) return 0;
  const dbytes = DTYPE_BYTES[dtype];
  const active = model.active_params_b * 1e9;
  const bw = gpu.mem_bw_tbs * 1e12;
  const flops = peakFlops(gpuId, dtype);
  const tStepMem = (active * dbytes) / (bw * MBU);
  const tStepCompute = (2 * active * batch) / (flops * MFU);
  const tStep = Math.max(tStepMem, tStepCompute);
  return batch / tStep;
}

/** Rough TTFT from prefill roofline (ms). */
export function estimateTtftMs(
  modelId: string,
  gpuId: string,
  dtype: Dtype,
  contextLen: number,
): number {
  const model = MODELS[modelId];
  if (!model) return 0;
  const flops = peakFlops(gpuId, dtype);
  const active = model.active_params_b * 1e9;
  return ((2 * active * contextLen) / (flops * MFU)) * 1e3 + 15;
}

export function gpusNeededForMemory(totalGb: number, gpuMemGb: number): number {
  return Math.max(1, Math.ceil((totalGb * MEM_SAFETY) / gpuMemGb));
}

export function monthlyGpuCost(gpuId: string, count: number, hoursPerDay: number): {
  daily: number;
  monthly: number;
  annual: number;
} {
  const gpu = GPUS[gpuId];
  if (!gpu) return { daily: 0, monthly: 0, annual: 0 };
  const daily = count * gpu.hourly_usd * hoursPerDay;
  return {
    daily: Math.round(daily),
    monthly: Math.round(daily * 30),
    annual: Math.round(daily * 365),
  };
}

export const modelOptions = () =>
  Object.values(MODELS).map((m) => ({ id: m.id, label: m.name }));

export const gpuOptions = () =>
  Object.values(GPUS).map((g) => ({ id: g.id, label: g.name }));

export const dtypeOptions: { id: Dtype; label: string }[] = [
  { id: "fp16", label: "FP16" },
  { id: "fp8", label: "FP8" },
  { id: "int8", label: "INT8" },
  { id: "int4", label: "INT4" },
];
