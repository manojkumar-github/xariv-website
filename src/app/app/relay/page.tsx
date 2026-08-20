"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useSessionAuth } from "@/components/auth/AuthProviders";
import {
  pulseApi,
  type RelayCatalog,
  type RelayDeployment,
  type RelayModel,
} from "@/lib/pulse-api";

export default function RelayPage() {
  const auth = useSessionAuth();
  const [catalog, setCatalog] = useState<RelayCatalog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [framework, setFramework] = useState("llama.cpp");
  const [localPath, setLocalPath] = useState("");

  const load = useCallback(async () => {
    if (!auth.isSignedIn) return;
    const token = await auth.getToken();
    if (!token) return;
    setCatalog(await pulseApi.relayCatalog(token));
  }, [auth]);

  useEffect(() => {
    if (!auth.isLoaded || !auth.isSignedIn) return;
    void load();
    const t = setInterval(() => void load(), 2500);
    return () => clearInterval(t);
  }, [auth.isLoaded, auth.isSignedIn, load]);

  async function withToken<T>(fn: (token: string) => Promise<T>) {
    const token = await auth.getToken();
    if (!token) throw new Error("Not signed in");
    return fn(token);
  }

  async function download(model: RelayModel) {
    setBusyId(model.id);
    setError(null);
    try {
      await withToken((t) => pulseApi.relayDownload(t, model.id));
      await load();
    } catch (e) {
      setError(String(e));
    } finally {
      setBusyId(null);
    }
  }

  async function deploy(model: RelayModel) {
    setBusyId(model.id);
    setError(null);
    try {
      await withToken((t) => pulseApi.relayDeploy(t, model.id, framework, model.recommended_port));
      await load();
    } catch (e) {
      setError(String(e));
    } finally {
      setBusyId(null);
    }
  }

  async function stop(dep: RelayDeployment) {
    setBusyId(dep.id);
    setError(null);
    try {
      await withToken((t) => pulseApi.relayStop(t, dep.id));
      await load();
    } catch (e) {
      setError(String(e));
    } finally {
      setBusyId(null);
    }
  }

  async function importLocal(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await withToken((t) => pulseApi.relayImport(t, localPath));
      setLocalPath("");
      await load();
    } catch (err) {
      setError(String(err));
    }
  }

  if (!auth.isLoaded) return <p className="text-sm text-muted">Loading…</p>;
  if (!auth.isSignedIn) {
    return (
      <p className="text-ink-soft">
        Sign in from the workspace to deploy models locally.
      </p>
    );
  }

  const running = catalog?.deployments.filter((d) => d.status === "running" || d.status === "starting") ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">XARIV Relay</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
            Serve open weights on this Mac
          </h1>
          <p className="mt-2 max-w-2xl text-ink-soft">
            Download a GGUF, pick llama.cpp, deploy to localhost. vLLM stays in the picker for
            Linux/NVIDIA — it will not start on macOS.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/app/hearth"
            className="rounded-lg bg-cta-gradient px-4 py-2 text-sm font-medium text-white"
          >
            Open Hearth chat
          </Link>
          <Link
            href="/relay/compare"
            className="rounded-lg border border-line bg-surface px-4 py-2 text-sm text-ink-soft hover:text-ink"
          >
            Speed demo (no download)
          </Link>
          <Link
            href="/app/relay/compare"
            className="rounded-lg border border-line bg-surface px-4 py-2 text-sm text-ink-soft hover:text-ink"
          >
            Compare
          </Link>
        </div>
      </div>

      {catalog && !catalog.llama_server && (
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <code className="rounded bg-white/80 px-1">llama-server</code> is not on PATH. Install with{" "}
          <code className="rounded bg-white/80 px-1">brew install llama.cpp</code>
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <label className="rounded-xl border border-line bg-surface p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">Serving framework</span>
          <select
            className="mt-2 w-full rounded-lg border border-line px-3 py-2 text-sm"
            value={framework}
            onChange={(e) => setFramework(e.target.value)}
          >
            {(catalog?.frameworks || []).map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} — {f.best_for}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-muted">
            Demo path: llama.cpp on Metal. vLLM is listed for later Linux GPU hosts.
          </p>
        </label>

        <form onSubmit={importLocal} className="rounded-xl border border-line bg-surface p-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Or import a local GGUF
          </span>
          <div className="mt-2 flex gap-2">
            <input
              className="flex-1 rounded-lg border border-line px-3 py-2 text-sm"
              placeholder="/Users/you/models/model.gguf"
              value={localPath}
              onChange={(e) => setLocalPath(e.target.value)}
            />
            <button
              type="submit"
              className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink"
            >
              Import
            </button>
          </div>
        </form>
      </div>

      {running.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-ink">Running locally</h2>
          <ul className="mt-3 divide-y divide-line rounded-xl border border-line bg-surface">
            {running.map((d) => (
              <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
                <div>
                  <p className="font-medium text-ink">
                    {d.name} · {d.variant}
                  </p>
                  <p className="text-muted">
                    {d.status} · port {d.port} · {d.openai_url}
                  </p>
                  {d.error && <p className="text-red-600">{d.error}</p>}
                </div>
                <button
                  type="button"
                  disabled={busyId === d.id}
                  onClick={() => void stop(d)}
                  className="rounded-lg border border-line px-3 py-1.5 text-xs text-ink-soft hover:text-ink"
                >
                  Stop
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {(catalog?.models || []).map((m) => {
          const downloading = m.artifact?.status === "downloading";
          const ready = m.local || m.artifact?.status === "ready";
          const live = running.find((d) => d.model_id === m.id);
          return (
            <div key={m.id} className="flex flex-col rounded-xl border border-line bg-surface p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                    {m.demo_role === "baseline"
                      ? "Demo A · non-quantized"
                      : m.demo_role === "quantized"
                        ? "Demo B · quantized"
                        : m.family}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-ink">{m.name}</h3>
                  <p className="text-sm text-ink-soft">{m.variant}</p>
                </div>
                <span className="rounded-full bg-canvas-subtle px-2 py-0.5 text-[11px] font-semibold text-muted">
                  {m.params}
                </span>
              </div>
              <p className="mt-3 flex-1 text-sm text-muted">{m.notes}</p>
              <p className="mt-2 font-mono text-xs text-muted">
                {m.hf_repo ? `${m.hf_repo}/${m.hf_file}` : m.hf_file} · ~{m.approx_size_gb} GB
              </p>
              {downloading && (
                <p className="mt-2 text-xs text-accent">
                  Downloading… {Math.round(m.artifact?.progress_pct || 0)}%
                </p>
              )}
              {m.artifact?.status === "error" && (
                <p className="mt-2 text-xs text-red-600">{m.artifact.error}</p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {!ready && (
                  <button
                    type="button"
                    disabled={busyId === m.id || downloading}
                    onClick={() => void download(m)}
                    className="rounded-lg bg-cta-gradient px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                  >
                    {downloading ? "Downloading…" : "Download from Hugging Face"}
                  </button>
                )}
                {ready && !live && (
                  <button
                    type="button"
                    disabled={busyId === m.id}
                    onClick={() => void deploy(m)}
                    className="rounded-lg bg-cta-gradient px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                  >
                    Deploy to localhost:{m.recommended_port}
                  </button>
                )}
                {live && (
                  <>
                    <span className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
                      Live on :{live.port}
                    </span>
                    <Link
                      href="/app/hearth"
                      className="rounded-lg border border-line px-3 py-2 text-sm font-medium text-ink"
                    >
                      Chat in Hearth
                    </Link>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
