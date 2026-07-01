/** Shared physical constants — mirrors backend app/engine/constants.py */
export const DTYPE_BYTES: Record<string, number> = {
  fp16: 2.0,
  fp8: 1.0,
  int8: 1.0,
  int4: 0.5,
};

export const MBU = 0.7;
export const MFU = 0.4;
export const KV_BYTES = 2.0;
export const GQA_FACTOR = 0.25;
export const MEM_SAFETY = 1.15;
export const FIXED_TTFT_MS = 15.0;
export const HOURS_PER_MONTH = 730.0;
export const SECONDS_PER_MONTH = 3600 * 24 * 30;
