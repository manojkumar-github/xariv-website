import type { Catalog, GPU, Model, Network } from "@/tools/types";

export const GPUS: Record<string, GPU> = {
  "h100-sxm": {
    id: "h100-sxm", name: "NVIDIA H100 SXM", vendor: "NVIDIA",
    memory_gb: 80, mem_bw_tbs: 3.35, fp16_tflops: 989, fp8_tflops: 1979,
    nvlink_gbs: 900, tdp_watts: 700, hourly_usd: 3.2,
  },
  h200: {
    id: "h200", name: "NVIDIA H200", vendor: "NVIDIA",
    memory_gb: 141, mem_bw_tbs: 4.8, fp16_tflops: 989, fp8_tflops: 1979,
    nvlink_gbs: 900, tdp_watts: 700, hourly_usd: 3.9,
  },
  b200: {
    id: "b200", name: "NVIDIA B200", vendor: "NVIDIA",
    memory_gb: 192, mem_bw_tbs: 8.0, fp16_tflops: 2250, fp8_tflops: 4500,
    nvlink_gbs: 1800, tdp_watts: 1000, hourly_usd: 6.5,
  },
  mi300x: {
    id: "mi300x", name: "AMD MI300X", vendor: "AMD",
    memory_gb: 192, mem_bw_tbs: 5.3, fp16_tflops: 1307, fp8_tflops: 2614,
    nvlink_gbs: 896, tdp_watts: 750, hourly_usd: 4.0,
  },
  l40s: {
    id: "l40s", name: "NVIDIA L40S", vendor: "NVIDIA",
    memory_gb: 48, mem_bw_tbs: 0.86, fp16_tflops: 362, fp8_tflops: 733,
    nvlink_gbs: 64, tdp_watts: 350, hourly_usd: 1.1,
  },
};

export const MODELS: Record<string, Model> = {
  "llama-3.1-8b": {
    id: "llama-3.1-8b", name: "Llama 3.1 8B", family: "Llama",
    total_params_b: 8, active_params_b: 8, num_layers: 32, hidden_size: 4096,
    is_moe: false, top_k: 1,
  },
  "llama-3.3-70b": {
    id: "llama-3.3-70b", name: "Llama 3.3 70B", family: "Llama",
    total_params_b: 70, active_params_b: 70, num_layers: 80, hidden_size: 8192,
    is_moe: false, top_k: 1,
  },
  "llama-3.1-405b": {
    id: "llama-3.1-405b", name: "Llama 3.1 405B", family: "Llama",
    total_params_b: 405, active_params_b: 405, num_layers: 126, hidden_size: 16384,
    is_moe: false, top_k: 1,
  },
  "qwen3-32b": {
    id: "qwen3-32b", name: "Qwen3 32B", family: "Qwen",
    total_params_b: 32, active_params_b: 32, num_layers: 64, hidden_size: 5120,
    is_moe: false, top_k: 1,
  },
  "qwen3-235b-moe": {
    id: "qwen3-235b-moe", name: "Qwen3 235B (MoE)", family: "Qwen",
    total_params_b: 235, active_params_b: 22, num_layers: 94, hidden_size: 4096,
    is_moe: true, top_k: 8,
  },
  "gemma-2-27b": {
    id: "gemma-2-27b", name: "Gemma 2 27B", family: "Gemma",
    total_params_b: 27, active_params_b: 27, num_layers: 46, hidden_size: 4608,
    is_moe: false, top_k: 1,
  },
};

export const NETWORKS: Record<string, Network> = {
  nvlink: { id: "nvlink", name: "NVLink / NVSwitch", per_gpu_gbs: 900, scope: "intra-node" },
  "ib-ndr": { id: "ib-ndr", name: "InfiniBand NDR 400G", per_gpu_gbs: 50, scope: "inter-node" },
  "roce-400": { id: "roce-400", name: "RoCEv2 400G", per_gpu_gbs: 45, scope: "inter-node" },
};

export function getCatalog(): Catalog {
  return {
    gpus: Object.values(GPUS),
    models: Object.values(MODELS),
    networks: Object.values(NETWORKS),
  };
}
