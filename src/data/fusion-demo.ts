/** Canned kernel-fusion replay — one decode step, llama.cpp Metal profile (Llama 3.2 1B). */

export type KernelCategory = "norm" | "rope" | "matmul" | "attn" | "act" | "view" | "fuse";

export type KernelEvent = {
  name: string;
  category: KernelCategory;
  /** GPU work time for this op (ms) */
  workMs: number;
  /** Host launch / sync gap before this op (ms) */
  launchMs: number;
};

export type FusionModel = {
  id: string;
  name: string;
  variant: string;
  layers: number;
  /** Recorded llama-bench tg64, fusion ON */
  tokPerSecFused: number;
  /** Recorded llama-bench tg64, GGML_METAL_FUSION_DISABLE=1 */
  tokPerSecUnfused: number;
};

export const FUSION_DEMO_MODELS: FusionModel[] = [
  {
    id: "q4",
    name: "Llama 3.2 1B Instruct",
    variant: "Q4_K_M",
    layers: 16,
    tokPerSecFused: 64.6,
    tokPerSecUnfused: 57.6,
  },
  {
    id: "f16",
    name: "Llama 3.2 1B Instruct",
    variant: "F16",
    layers: 16,
    tokPerSecFused: 22.5,
    tokPerSecUnfused: 22.0,
  },
];

/** Micro-ops for one transformer block — unfused Metal graph (illustrative). */
const UNFUSED_BLOCK: KernelEvent[] = [
  { name: "RMS_NORM", category: "norm", workMs: 0.04, launchMs: 0.022 },
  { name: "ROPE_Q", category: "rope", workMs: 0.03, launchMs: 0.02 },
  { name: "ROPE_K", category: "rope", workMs: 0.03, launchMs: 0.02 },
  { name: "MUL_MAT Q", category: "matmul", workMs: 0.11, launchMs: 0.022 },
  { name: "MUL_MAT K", category: "matmul", workMs: 0.1, launchMs: 0.022 },
  { name: "MUL_MAT V", category: "matmul", workMs: 0.1, launchMs: 0.022 },
  { name: "VIEW", category: "view", workMs: 0.008, launchMs: 0.018 },
  { name: "VIEW", category: "view", workMs: 0.008, launchMs: 0.018 },
  { name: "SOFT_MAX", category: "attn", workMs: 0.09, launchMs: 0.022 },
  { name: "MUL_MAT attn", category: "matmul", workMs: 0.12, launchMs: 0.022 },
  { name: "ADD", category: "act", workMs: 0.025, launchMs: 0.02 },
  { name: "RMS_NORM", category: "norm", workMs: 0.04, launchMs: 0.022 },
  { name: "MUL_MAT gate", category: "matmul", workMs: 0.14, launchMs: 0.022 },
  { name: "MUL_MAT up", category: "matmul", workMs: 0.14, launchMs: 0.022 },
  { name: "SILU", category: "act", workMs: 0.05, launchMs: 0.02 },
  { name: "MUL", category: "act", workMs: 0.035, launchMs: 0.02 },
  { name: "MUL_MAT down", category: "matmul", workMs: 0.15, launchMs: 0.022 },
  { name: "ADD", category: "act", workMs: 0.025, launchMs: 0.02 },
  { name: "VIEW", category: "view", workMs: 0.008, launchMs: 0.018 },
  { name: "CPY", category: "view", workMs: 0.012, launchMs: 0.018 },
  { name: "VIEW", category: "view", workMs: 0.008, launchMs: 0.018 },
  { name: "RESHAPE", category: "view", workMs: 0.006, launchMs: 0.016 },
  { name: "CONT", category: "view", workMs: 0.006, launchMs: 0.016 },
  { name: "VIEW", category: "view", workMs: 0.008, launchMs: 0.018 },
  { name: "VIEW", category: "view", workMs: 0.008, launchMs: 0.018 },
  { name: "VIEW", category: "view", workMs: 0.008, launchMs: 0.018 },
  { name: "VIEW", category: "view", workMs: 0.008, launchMs: 0.018 },
];

/** Fused blocks for the same block — fewer launches, slightly longer fused kernels. */
const FUSED_BLOCK: KernelEvent[] = [
  { name: "FUSE norm+rope+qkv", category: "fuse", workMs: 0.38, launchMs: 0.024 },
  { name: "FUSE attn+softmax", category: "fuse", workMs: 0.42, launchMs: 0.024 },
  { name: "FUSE attn·V+residual", category: "fuse", workMs: 0.35, launchMs: 0.022 },
  { name: "FUSE norm+ffn gate/up", category: "fuse", workMs: 0.48, launchMs: 0.024 },
  { name: "FUSE silu·mul", category: "fuse", workMs: 0.18, launchMs: 0.02 },
  { name: "FUSE ffn down+residual", category: "fuse", workMs: 0.4, launchMs: 0.022 },
  { name: "FUSE view chain", category: "fuse", workMs: 0.09, launchMs: 0.018 },
  { name: "FUSE epilogue", category: "fuse", workMs: 0.12, launchMs: 0.018 },
  { name: "FUSE rope epilogue", category: "fuse", workMs: 0.1, launchMs: 0.018 },
  { name: "FUSE qkv epilogue", category: "fuse", workMs: 0.11, launchMs: 0.018 },
  { name: "FUSE mlp tail", category: "fuse", workMs: 0.14, launchMs: 0.018 },
];

export type DecodeProfile = {
  fused: boolean;
  label: string;
  subtitle: string;
  kernels: KernelEvent[];
  kernelCount: number;
  launchOverheadMs: number;
  computeMs: number;
  stepMs: number;
  tokPerSec: number;
};

export function buildDecodeProfile(model: FusionModel, fused: boolean): DecodeProfile {
  const block = fused ? FUSED_BLOCK : UNFUSED_BLOCK;
  const kernels: KernelEvent[] = [];
  for (let layer = 0; layer < model.layers; layer += 1) {
    for (const op of block) {
      kernels.push({ ...op, name: layer === 0 ? op.name : op.name });
    }
  }

  const launchOverheadMs = kernels.reduce((s, k) => s + k.launchMs, 0);
  const computeMs = kernels.reduce((s, k) => s + k.workMs, 0);
  const rawStepMs = launchOverheadMs + computeMs;
  const targetStepMs = 1000 / (fused ? model.tokPerSecFused : model.tokPerSecUnfused);
  const scale = targetStepMs / rawStepMs;

  const scaled = kernels.map((k) => ({
    ...k,
    workMs: k.workMs * scale,
    launchMs: k.launchMs * scale,
  }));

  const stepMs = scaled.reduce((s, k) => s + k.workMs + k.launchMs, 0);

  return {
    fused,
    label: fused ? "Metal fusion ON" : "Fusion disabled",
    subtitle: fused
      ? "Default llama.cpp — fused RMSNorm·RoPE·QKV, attn epilogues"
      : "GGML_METAL_FUSION_DISABLE=1 — every micro-op launches separately",
    kernels: scaled,
    kernelCount: scaled.length,
    launchOverheadMs: scaled.reduce((s, k) => s + k.launchMs, 0),
    computeMs: scaled.reduce((s, k) => s + k.workMs, 0),
    stepMs,
    tokPerSec: 1000 / stepMs,
  };
}

export const KERNEL_COLORS: Record<KernelCategory, string> = {
  norm: "#8b5cf6",
  rope: "#6366f1",
  matmul: "#3b82f6",
  attn: "#0ea5e9",
  act: "#14b8a6",
  view: "#a1a1aa",
  fuse: "#5b4bf0",
};
