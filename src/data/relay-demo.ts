/** Canned Relay compare replay — recorded-style, ships with the website (no GGUF). */

export const RELAY_DEMO_PROMPT =
  "Explain KV cache in one short paragraph, then list three ways quantization changes decode speed.";

export const RELAY_DEMO_ANSWER = `KV cache stores key and value tensors from earlier tokens so the model does not recompute the full attention history on every decode step. That turns generation from quadratic work into mostly linear work as the sequence grows.

1. Fewer bits per weight shrinks matrix multiplies, so each decode step finishes sooner on the same chip.
2. The working set often fits in faster memory, which cuts bandwidth stalls during token-by-token generation.
3. Prefill still dominates time-to-first-token; quantization helps there too, but the live stream usually shows the bigger gap on tokens per second.`;

export const RELAY_DEMO_LEFT = {
  id: "demo-f16",
  name: "Llama 3.2 1B Instruct",
  variant: "F16 (non-quantized)",
  port: 8090,
  quantized: false,
  /** Simulated Metal laptop: slower decode */
  ttftMs: 420,
  msPerWord: 78,
};

export const RELAY_DEMO_RIGHT = {
  id: "demo-q4",
  name: "Llama 3.2 1B Instruct",
  variant: "Q4_K_M (quantized)",
  port: 8091,
  quantized: true,
  ttftMs: 165,
  msPerWord: 24,
};

export function wordsOf(text: string): string[] {
  return text.split(/(\s+)/).filter((w) => w.length > 0);
}
