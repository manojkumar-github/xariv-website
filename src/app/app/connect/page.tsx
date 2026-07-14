"use client";

import { useEffect, useState } from "react";
import { useSessionAuth } from "@/components/auth/AuthProviders";
import { pulseApi, type AgentInfo } from "@/lib/pulse-api";

export default function ConnectPage() {
  const auth = useSessionAuth();
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [expires, setExpires] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function refreshAgents() {
    const t = await auth.getToken();
    if (!t) return;
    setAgents(await pulseApi.listAgents(t));
  }

  useEffect(() => {
    if (auth.isSignedIn) void refreshAgents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.isSignedIn]);

  async function createToken() {
    setBusy(true);
    setError(null);
    try {
      const t = await auth.getToken();
      if (!t) throw new Error("Not signed in");
      const res = await pulseApi.createConnectToken(t, "local");
      setToken(res.connect_token);
      setExpires(res.expires_at);
      await refreshAgents();
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  }

  if (!auth.isLoaded) return <p className="text-sm text-muted">Loading…</p>;
  if (!auth.isSignedIn) {
    return <p className="text-ink-soft">Sign in from the workspace to connect an agent.</p>;
  }

  return (
    <div className="max-w-2xl">
      <p className="eyebrow">Local agent</p>
      <h1 className="mt-2 text-3xl font-semibold text-ink">Connect your machine</h1>
      <p className="mt-2 text-ink-soft">
        XARIV does not own your GPUs. The CLI on your laptop claims queued experiments and runs
        them against your inference server.
      </p>

      <ol className="mt-8 list-decimal space-y-3 pl-5 text-sm text-ink-soft">
        <li>Generate a one-time connect token below (expires in ~15 minutes).</li>
        <li>
          On your machine:{" "}
          <code className="rounded bg-code-bg px-1.5 py-0.5 text-ink">
            xariv-pulse connect --token &lt;TOKEN&gt;
          </code>
        </li>
        <li>
          Start the agent loop:{" "}
          <code className="rounded bg-code-bg px-1.5 py-0.5 text-ink">xariv-pulse agent</code>
        </li>
        <li>Queue an experiment from the web app — the agent picks it up automatically.</li>
      </ol>

      <button
        type="button"
        disabled={busy}
        onClick={() => void createToken()}
        className="mt-8 rounded-lg bg-cta-gradient px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
      >
        {busy ? "Generating…" : "Generate connect token"}
      </button>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {token && (
        <div className="mt-6 rounded-xl border border-accent/20 bg-accent-muted/40 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">Connect token</p>
          <code className="mt-3 block break-all rounded-lg bg-surface px-3 py-3 font-mono text-sm text-ink">
            {token}
          </code>
          <p className="mt-3 text-xs text-muted">
            Expires {expires ? new Date(expires).toLocaleString() : "soon"}. Run:
          </p>
          <pre className="mt-2 overflow-x-auto rounded-lg bg-code-block-bg p-3 text-xs text-code-block-fg">
            {`export PULSE_API_URL=http://localhost:8000
xariv-pulse connect --token ${token}
xariv-pulse agent`}
          </pre>
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-ink">Your agents</h2>
        {agents.length === 0 ? (
          <p className="mt-2 text-sm text-muted">No agents connected yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-line rounded-xl border border-line bg-surface">
            {agents.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                <div>
                  <p className="font-medium text-ink">{a.name}</p>
                  <p className="text-muted">
                    {a.hostname || "unknown host"} · {a.status}
                  </p>
                </div>
                <p className="text-xs text-muted">
                  {a.last_seen_at ? `Seen ${new Date(a.last_seen_at).toLocaleString()}` : "Never seen"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
