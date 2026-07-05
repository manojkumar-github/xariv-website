import type { EcoMetrics, GPU } from "@/tools/types";

/** US grid average — kg CO₂ per kWh (EPA eGRID ~0.385). */
export const GRID_CO2_KG_PER_KWH = 0.385;

export type { EcoMetrics };

/** Idle floor + load-scaled draw, matching Pulse telemetry model. */
export function loadFactor(utilPct: number): number {
  return 0.32 + 0.68 * Math.min(100, Math.max(0, utilPct)) / 100;
}

export function temperatureC(powerW: number, tdpW: number): number {
  if (tdpW <= 0) return 34;
  return Math.round(34 + 46 * (powerW / tdpW));
}

export interface EcoInput {
  gpu: GPU;
  gpuCount: number;
  /** 0–100 workload utilization driving power draw. */
  utilPct: number;
  /** Output tokens per day for carbon intensity (0 → carbon = 0). */
  outputTokensPerDay: number;
  /** Hours/day the fleet runs at this load (default 24). */
  hoursPerDay?: number;
}

export function computeEcoMetrics(input: EcoInput): EcoMetrics {
  const { gpu, gpuCount, utilPct, outputTokensPerDay, hoursPerDay = 24 } = input;
  const lf = loadFactor(utilPct);
  const tdpFleetW = gpu.tdp_watts * gpuCount;
  const powerStreamingKw = (gpu.tdp_watts * lf * gpuCount) / 1000;
  // Average blends idle floor with streaming draw for sustained 24h operation.
  const powerKw = (gpu.tdp_watts * (0.18 + 0.82 * lf) * gpuCount) / 1000;
  const energy = powerKw * hoursPerDay;
  const co2 = energy * GRID_CO2_KG_PER_KWH;
  const carbon =
    outputTokensPerDay > 0
      ? (co2 / outputTokensPerDay) * 1e6
      : 0;
  const powerStreamingW = powerStreamingKw * 1000;
  const temperature = temperatureC(powerStreamingW, tdpFleetW);

  const r1 = (n: number) => Math.round(n * 10) / 10;
  const r2 = (n: number) => Math.round(n * 100) / 100;

  return {
    power: r1(powerKw),
    power_streaming: r1(powerStreamingKw),
    energy: r1(energy),
    co2: r1(co2),
    carbon: r2(carbon),
    temperature,
  };
}

/** Letter grade from carbon intensity (kg CO₂ / 1M output tokens). */
export function ecoImpactRating(carbon: number): string {
  if (carbon <= 0) return "—";
  if (carbon < 0.05) return "A+";
  if (carbon < 0.1) return "A";
  if (carbon < 0.2) return "B";
  if (carbon < 0.4) return "C";
  if (carbon < 0.8) return "D";
  return "F";
}

export function ecoMetricRows(m: EcoMetrics, opts?: { rating?: boolean }): { label: string; value: string }[] {
  const rows = [
    { label: "power", value: `${m.power} kW` },
    { label: "power_streaming", value: `${m.power_streaming} kW` },
    { label: "energy", value: `${m.energy} kWh/day` },
    { label: "co2", value: `${m.co2} kg CO₂/day` },
    { label: "carbon", value: `${m.carbon} kg CO₂ / 1M tokens` },
    { label: "temperature", value: `${m.temperature} °C` },
  ];
  if (opts?.rating) {
    rows.push({ label: "eco impact rating", value: ecoImpactRating(m.carbon) });
  }
  return rows;
}
