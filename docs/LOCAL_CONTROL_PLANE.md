# Local control-plane MVP (website ↔ Pulse)

XARIV is the **control plane**. Benchmarks execute on the user's machine via the Pulse CLI agent.

## Architecture (v1)

```
Browser  xariv-website (/app)
   │  Clerk JWT  (or Bearer dev:<id> locally)
   ▼
Pulse API  xariv-pulse/backend  :8000
   │  agent token
   ▼
CLI agent  `xariv-pulse agent`  → local llama.cpp / vLLM
```

## 1. Start Pulse API

```bash
cd xariv-pulse/backend
python3.11 -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
export ALLOW_DEV_AUTH=true
export CORS_ORIGINS=http://localhost:3000,http://localhost:3001
uvicorn app.main:app --reload --port 8000
```

Swagger: http://localhost:8000/docs

## 2. Start website

```bash
cd xariv-website
cp .env.local.example .env.local
npm install
npm run dev
```

Open http://localhost:3000/app → **Dev sign in** (no Clerk keys needed).

## 3. Connect local agent

In the web UI: **Connect agent** → copy token.

```bash
cd xariv-pulse
# install CLI + SDK (see repo Makefile)
export PULSE_API_URL=http://localhost:8000
xariv-pulse connect --token <TOKEN>
# start your inference server first (e.g. llama-server :8080)
xariv-pulse agent
```

## 4. Queue an experiment

`/app/experiments/new` → Queue → agent claims → profile table updates.

## Clerk (optional, production)

Set in `xariv-website/.env.local`:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

Set on Pulse API:

```
ALLOW_DEV_AUTH=false
CLERK_ISSUER=https://<your-instance>.clerk.accounts.dev
CLERK_JWKS_URL=https://<your-instance>.clerk.accounts.dev/.well-known/jwks.json
```

## What is deliberately out of scope (v1)

- Cloud / K8s / AWS targets
- Hosted GPUs
- Public leaderboard privacy coupling (community submit still exists separately)
