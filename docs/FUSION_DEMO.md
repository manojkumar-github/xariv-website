# XARIV Fusion Studio — local & Vercel demo

**Fusion Studio** replays one decode step with vs without llama.cpp Metal kernel fusion. Same model, same math — fewer GPU launches on the fused side.

## Quick start (browser only)

```bash
cd xariv-website
npm run dev
```

Open:

- http://localhost:3000/fusion — landing
- http://localhost:3000/fusion/compare — split-pane replay

No Pulse API or model download required for the replay.

## What you show

| Pane | Setting | What it illustrates |
|------|---------|---------------------|
| Left | `GGML_METAL_FUSION_DISABLE=1` | ~430 micro-kernel launches per decode step |
| Right | Default Metal fusion | ~180 fused blocks, less launch overhead |

Pick **Q4_K_M** or **F16** in the model dropdown. Click **Run decode step on both**.

## Real numbers on your Mac (optional)

If you already cached GGUFs via Relay:

```bash
MODEL=~/.xariv/relay/models/Llama-3.2-1B-Instruct-Q4_K_M.gguf

llama-bench -m "$MODEL" -p 128 -n 64
GGML_METAL_FUSION_DISABLE=1 llama-bench -m "$MODEL" -p 128 -n 64
```

Fusion impact is most visible on short prompts (`-p 8`) and decode (`tg*` rows).

## Vercel (public site)

Ship the replay pages only — no GGUF files, no llama-server:

- https://xarivlabs.com/fusion
- https://xarivlabs.com/fusion/compare

Labeled as illustrative replay, same pattern as `/relay/compare`.

## Related

- [Kernel fusion architecture study](https://xarivlabs.com/architecture-studies/kernel-fusion-llm-inference)
- [Relay demo](./RELAY_DEMO.md) — F16 vs Q4 quantization compare
