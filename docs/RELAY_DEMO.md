# XARIV Relay — local Mac demo

**Relay** is the self-hosted serving module. XARIV stays the control plane; models run on **your Mac**.

vLLM is in the framework picker for later Linux/NVIDIA hosts. **This Mac demo uses llama.cpp** (`llama-server` + Metal).

## Demo story

Same architecture, two weights:

| Pane | Model | Port | What you show |
|------|--------|------|----------------|
| Left | Llama 3.2 1B Instruct **F16** | 8090 | Non-quantized — slower |
| Right | Llama 3.2 1B Instruct **Q4_K_M** | 8091 | Quantized — faster stream / tok/s |

## Prerequisites

```bash
brew install llama.cpp
# confirm:
which llama-server
```

Accept Meta’s Llama license on Hugging Face if prompted during download.

## Run

**API** (same as Pulse):

```bash
cd xariv-pulse/backend
source .venv/bin/activate
pip install -e ".[dev]"   # adds huggingface_hub
export ALLOW_DEV_AUTH=true CORS_ORIGINS=http://localhost:3000
uvicorn app.main:app --reload --port 8000
```

**Website:**

```bash
cd xariv-website
npm run dev
```

1. Open http://localhost:3000/app → Dev sign in  
2. **Relay** → download both Llama 3.2 1B GGUFs (F16 ~2.5GB, Q4 ~0.8GB)  
   Files land in `~/.xariv/relay/models/`  
3. Framework = **llama.cpp** → Deploy each (8090 and 8091)  
4. **Compare** → same prompt → **Send to both**

You can also paste a local `.gguf` path and Import.

## Call a hosted model yourself

After deploy:

```bash
curl http://127.0.0.1:8091/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{"model":"llama-3.2-1b-instruct-q4","messages":[{"role":"user","content":"Hello"}],"max_tokens":64}'
```

## Public website (Vercel)

Do **not** ship GGUF files to Vercel (too large; Vercel cannot run llama-server).

The live site includes a **timing replay**:

- https://xarivlabs.com/relay
- https://xarivlabs.com/relay/compare

That is enough to show F16 vs Q4 stream speed. It is labeled as a replay.

## Local cache (real inference)

First Hugging Face download writes:

`~/.xariv/relay/models/`

A later **Deploy** reuses those files — no second download.

