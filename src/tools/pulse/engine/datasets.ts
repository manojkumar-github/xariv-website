import type { DatasetPreset } from "@/tools/types";

/**
 * Representative token-length profiles for well-known public datasets.
 * Means/std are first-order estimates of prompt and response token counts
 * (tokenizer-agnostic), used to synthesize a realistic request mix.
 */
export const DATASETS: Record<string, DatasetPreset> = {
  sharegpt: {
    id: "sharegpt",
    name: "ShareGPT",
    source: "anon8231489123/ShareGPT_Vicuna_unfiltered",
    prompt_mean: 256,
    prompt_std: 200,
    output_mean: 230,
    output_std: 170,
    blurb: "Real multi-turn ChatGPT conversations — long, varied prompts and answers.",
  },
  "lmsys-chat": {
    id: "lmsys-chat",
    name: "LMSYS-Chat-1M",
    source: "lmsys/lmsys-chat-1m",
    prompt_mean: 92,
    prompt_std: 110,
    output_mean: 150,
    output_std: 130,
    blurb: "1M real-world chats across many models — shorter, conversational.",
  },
  alpaca: {
    id: "alpaca",
    name: "Alpaca",
    source: "tatsu-lab/alpaca",
    prompt_mean: 32,
    prompt_std: 22,
    output_mean: 66,
    output_std: 48,
    blurb: "Instruction-tuning prompts — short instructions, compact answers.",
  },
  "long-context": {
    id: "long-context",
    name: "Long-context RAG",
    source: "synthetic / retrieval-augmented",
    prompt_mean: 6000,
    prompt_std: 2200,
    output_mean: 320,
    output_std: 180,
    blurb: "Retrieval-heavy prompts — large context, modest generation.",
  },
  custom: {
    id: "custom",
    name: "Custom dataset",
    source: "user-provided",
    prompt_mean: 256,
    prompt_std: 120,
    output_mean: 128,
    output_std: 64,
    blurb: "Paste your own prompts (one per line); tokens estimated at ~4 chars/token.",
  },
};

export function datasetList(): DatasetPreset[] {
  return Object.values(DATASETS);
}
