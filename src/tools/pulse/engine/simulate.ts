import { GPUS, MODELS } from "@/tools/engine/catalog";
import {
  DTYPE_BYTES,
  MBU,
  MFU,
  KV_BYTES,
  GQA_FACTOR,
  MEM_SAFETY,
  FIXED_TTFT_MS,
} from "@/tools/engine/constants";
import { DATASETS } from "./datasets";
import { computeEcoMetrics, loadFactor, temperatureC } from "@/tools/engine/eco";
import type {
  MetricSummary,
  PulseReport,
  PulseSpec,
  DatasetPreset,
} from "@/tools/types";

/** Deterministic PRNG so a given spec always produces the same report. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Box–Muller normal, clamped to a sane positive token count. */
function sampleTokens(rng: () => number, mean: number, std: number, min: number): number {
  const u1 = Math.max(rng(), 1e-9);
  const u2 = rng();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return Math.max(min, Math.round(mean + z * std));
}

function summarize(values: number[]): MetricSummary {
  const sorted = [...values].sort((a, b) => a - b);
  const at = (q: number) => sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))];
  const mean = sorted.reduce((s, v) => s + v, 0) / sorted.length;
  const r1 = (n: number) => Math.round(n * 10) / 10;
  return { p50: r1(at(0.5)), p90: r1(at(0.9)), p99: r1(at(0.99)), mean: r1(mean) };
}

function peakFlops(fp16: number, fp8: number, dtype: string): number {
  return (["fp8", "int8", "int4"].includes(dtype) ? fp8 : fp16) * 1e12;
}

/** Estimate token counts for a pasted custom dataset (~4 chars per token). */
function customSamples(spec: PulseSpec): { prompt: number; output: number }[] {
  const lines = spec.custom_text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return [];
  return lines.map((l) => ({
    prompt: Math.max(1, Math.round(l.length / 4)),
    output: Math.max(1, Math.round(spec.custom_output_tokens)),
  }));
}

export function runPulse(spec: PulseSpec): PulseReport {
  const gpu = GPUS[spec.gpu_id];
  const model = MODELS[spec.model_id];
  const preset: DatasetPreset = DATASETS[spec.dataset] ?? DATASETS.sharegpt;
  if (!gpu || !model) throw new Error("Unknown model or GPU selection.");

  const dtype = spec.dtype;
  const dbytes = DTYPE_BYTES[dtype];
  const batch = Math.max(1, Math.floor(spec.concurrency));
  const activeParams = model.active_params_b * 1e9;
  const bw = gpu.mem_bw_tbs * 1e12;
  const flops = peakFlops(gpu.fp16_tflops, gpu.fp8_tflops, dtype);

  // --- per-decode-step time at this batch (roofline) ---
  const weightBytes = activeParams * dbytes;
  const tStepMem = weightBytes / (bw * MBU); // s, batch-independent
  const tStepCompute = (2 * activeParams * batch) / (flops * MFU); // s
  const tStep = Math.max(tStepMem, tStepCompute);
  const memoryBound = tStepMem >= tStepCompute;
  const tpotBaseMs = tStep * 1e3; // per output token, per request (decode step)

  // --- build the request mix ---
  const rng = mulberry32(
    (spec.num_requests * 2654435761 + batch * 40503 + spec.dataset.length) >>> 0,
  );
  let mix: { prompt: number; output: number }[];
  if (spec.dataset === "custom") {
    mix = customSamples(spec);
    if (mix.length === 0) {
      mix = Array.from({ length: spec.num_requests }, () => ({
        prompt: sampleTokens(rng, preset.prompt_mean, preset.prompt_std, 1),
        output: Math.max(1, Math.round(spec.custom_output_tokens)),
      }));
    }
  } else {
    mix = Array.from({ length: spec.num_requests }, () => ({
      prompt: sampleTokens(rng, preset.prompt_mean, preset.prompt_std, 1),
      output: sampleTokens(rng, preset.output_mean, preset.output_std, 1),
    }));
  }

  const ttft: number[] = [];
  const itl: number[] = [];
  const tpot: number[] = [];
  const e2e: number[] = [];
  let totalOutput = 0;
  let sumPrompt = 0;

  for (const req of mix) {
    sumPrompt += req.prompt;
    totalOutput += req.output;

    // TTFT: prefill is compute-bound over the prompt, + scheduling floor + jitter.
    const prefillMs = ((2 * activeParams * req.prompt) / (flops * MFU)) * 1e3;
    const jitterT = 1 + (rng() - 0.5) * 0.18;
    const ttftMs = (prefillMs + FIXED_TTFT_MS) * jitterT;

    // ITL/TPOT: decode step time with small per-token scheduling jitter.
    const jitterI = 1 + (rng() - 0.5) * 0.1;
    const itlMs = tpotBaseMs * jitterI;
    const tpotMs = tpotBaseMs; // steady-state time per output token

    const e2eMs = ttftMs + Math.max(0, req.output - 1) * itlMs;

    ttft.push(ttftMs);
    itl.push(itlMs);
    tpot.push(tpotMs);
    e2e.push(e2eMs);
  }

  const samples = mix.length;
  const promptAvg = Math.round(sumPrompt / samples);
  const outputAvg = Math.round(totalOutput / samples);
  const seqAvg = promptAvg + outputAvg;

  // --- throughput (steady-state, full concurrency) ---
  const aggregateTps = batch / tStep; // output tokens/sec across the batch
  const avgE2eSec = e2e.reduce((s, v) => s + v, 0) / samples / 1e3;
  const throughputRps = batch / Math.max(avgE2eSec, 1e-6);

  // --- telemetry ---
  const weightsGb = model.total_params_b * dbytes;
  const kvPerTok = 2 * model.num_layers * model.hidden_size * GQA_FACTOR * KV_BYTES;
  const kvGb = (batch * seqAvg * kvPerTok) / 1e9;
  const memUsedGb = (weightsGb + kvGb) * MEM_SAFETY;
  const gpusNeeded = Math.max(1, Math.ceil(memUsedGb / gpu.memory_gb));
  const capacityGb = gpusNeeded * gpu.memory_gb;
  const memUtil = Math.min(100, (100 * memUsedGb) / capacityGb);

  const smUtil = memoryBound
    ? Math.min(100, (tStepCompute / tStepMem) * 100)
    : Math.min(100, MFU * 100 + 8);
  const memBwUtil = memoryBound
    ? Math.min(100, MBU * 100 + 8)
    : Math.min(100, (tStepMem / tStepCompute) * 100);

  const lf = loadFactor(Math.max(smUtil, memBwUtil));
  const powerW = gpu.tdp_watts * lf;
  const tempC = temperatureC(powerW * gpusNeeded, gpu.tdp_watts * gpusNeeded);

  const outputTokensPerDay = aggregateTps * 86400;
  const eco = computeEcoMetrics({
    gpu,
    gpuCount: gpusNeeded,
    utilPct: Math.max(smUtil, memBwUtil),
    outputTokensPerDay,
  });

  const notes: string[] = [
    `Simulated ${samples.toLocaleString()} requests at concurrency ${batch} on ${gpu.name} (${dtype.toUpperCase()}).`,
    `Decode is ${memoryBound ? "memory-bandwidth" : "compute"}-bound at this batch — TPOT ≈ ${(tpotBaseMs).toFixed(2)} ms/token.`,
    `KV cache ≈ ${kvGb.toFixed(1)} GB; weights ≈ ${weightsGb.toFixed(1)} GB; fits in ${gpusNeeded} × ${gpu.name}.`,
    `Eco: power_streaming ${eco.power_streaming} kW · ${eco.co2} kg CO₂/day · carbon ${eco.carbon} kg/1M tokens.`,
    "First-order roofline estimates (MBU 70% / MFU 40%), not a live benchmark — deterministic per input.",
  ];

  return {
    dataset_name: preset.name,
    samples,
    prompt_tokens_avg: promptAvg,
    output_tokens_avg: outputAvg,
    total_output_tokens: totalOutput,
    ttft_ms: summarize(ttft),
    itl_ms: summarize(itl),
    tpot_ms: summarize(tpot),
    e2e_ms: summarize(e2e),
    throughput_tps: Math.round(aggregateTps),
    throughput_rps: Math.round(throughputRps * 10) / 10,
    telemetry: {
      regime: memoryBound ? "memory-bound" : "compute-bound",
      sm_util_pct: Math.round(smUtil * 10) / 10,
      mem_used_gb: Math.round(memUsedGb * 10) / 10,
      mem_capacity_gb: Math.round(capacityGb * 10) / 10,
      mem_util_pct: Math.round(memUtil * 10) / 10,
      mem_bw_util_pct: Math.round(memBwUtil * 10) / 10,
      power_w: Math.round(powerW * gpusNeeded),
      tdp_w: Math.round(gpu.tdp_watts * gpusNeeded),
      temp_c: eco.temperature,
      gpus_needed: gpusNeeded,
    },
    eco,
    notes,
  };
}
