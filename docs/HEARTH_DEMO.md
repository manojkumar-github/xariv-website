# XARIV Hearth — local ChatGPT on your Mac

**Hearth** is your private chat host — a ChatGPT-like UI over **Relay** + **llama.cpp**. Everything runs on your Mac; nothing is sent to XARIV cloud.

Inspired by local-first apps like [Osaurus](https://osaurus.ai/), but integrated with the XARIV control plane. No `.dmg` yet — test in the browser locally first; packaged **XARIV Hearth.app** comes later.

## Architecture

```
Browser  /app/hearth
   │  Pulse API :8000  (chat proxy)
   ▼
llama-server  localhost:8091  (Metal)
   │
GGUF in ~/.xariv/relay/models/
```

Chat goes through Pulse so the browser never hits `127.0.0.1` directly (CORS-safe for production builds too).

## Quick start

**1. Pulse API**

```bash
cd xariv-pulse/backend
source .venv/bin/activate
export ALLOW_DEV_AUTH=true CORS_ORIGINS=http://localhost:3000
uvicorn app.main:app --reload --port 8000
```

**2. Website**

```bash
cd xariv-website
npm run dev
```

**3. Open Hearth**

1. http://localhost:3000/app → **Dev sign in**
2. http://localhost:3000/app/hearth
3. Pick a model → **Deploy & chat** (or download first if missing)
4. Start chatting

Or deploy from **Relay** first, then open Hearth.

## Models (1–3B)

| Model | Port | Size |
|-------|------|------|
| Llama 3.2 1B Q4_K_M | 8091 | ~0.8 GB |
| Llama 3.2 1B F16 | 8090 | ~2.5 GB |
| Llama 3.2 3B Q4_K_M | 8092 | ~2.0 GB |

Requires `brew install llama.cpp`.

## Public pages (Vercel)

- https://xarivlabs.com/hearth — product landing
- Live chat requires Pulse + llama.cpp on the user's Mac (not hosted on Vercel)

## Roadmap

- [ ] **XARIV Hearth.app** (.dmg) — native shell, bundled Pulse + llama.cpp launcher
- [ ] Fine-tune models via Relay, host and publish custom GGUFs
- [ ] Conversation history on disk (`~/.xariv/hearth/`)

## Related

- [RELAY_DEMO.md](./RELAY_DEMO.md) — download, deploy, compare
- [LOCAL_CONTROL_PLANE.md](./LOCAL_CONTROL_PLANE.md) — Pulse + auth setup
