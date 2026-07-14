"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useSessionAuth } from "@/components/auth/AuthProviders";
import { pulseApi, type ExperimentDetail } from "@/lib/pulse-api";

export default function ExperimentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const auth = useSessionAuth();
  const [exp, setExp] = useState<ExperimentDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!auth.isSignedIn || !id) return;
    try {
      const token = await auth.getToken();
      if (!token) return;
      setExp(await pulseApi.getExperiment(token, id));
    } catch (e) {
      setError(String(e));
    }
  }, [auth, id]);

  useEffect(() => {
    void load();
    const t = setInterval(() => void load(), 4000);
    return () => clearInterval(t);
  }, [load]);

  async function cancel() {
    if (!exp) return;
    const token = await auth.getToken();
    if (!token) return;
    setExp(await pulseApi.cancelExperiment(token, exp.id));
  }

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!exp) return <p className="text-sm text-muted">Loading…</p>;

  return (
    <div className="max-w-3xl">
      <Link href="/app" className="text-sm text-muted hover:text-ink">
        ← Experiments
      </Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-ink">{exp.name}</h1>
          <p className="mt-2 text-sm text-muted">
            Status: <span className="font-semibold text-ink">{exp.status}</span>
          </p>
        </div>
        {["queued", "claimed", "running"].includes(exp.status) && (
          <button
            type="button"
            onClick={() => void cancel()}
            className="rounded-lg border border-line px-4 py-2 text-sm text-ink-soft hover:text-ink"
          >
            Cancel
          </button>
        )}
      </div>

      <dl className="mt-8 grid gap-4 rounded-xl border border-line bg-surface p-6 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase text-muted">Model</dt>
          <dd className="mt-1 text-sm text-ink">{exp.model_id}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-muted">Engine</dt>
          <dd className="mt-1 text-sm text-ink">{exp.engine}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-muted">Workload</dt>
          <dd className="mt-1 text-sm text-ink">{exp.workload_id}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-muted">Hardware</dt>
          <dd className="mt-1 text-sm text-ink">{exp.hardware_label || "—"}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-muted">Throughput</dt>
          <dd className="mt-1 font-mono text-sm text-ink">
            {exp.throughput_tps != null ? `${exp.throughput_tps.toFixed(1)} TPS` : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase text-muted">TTFT p50 / p99</dt>
          <dd className="mt-1 font-mono text-sm text-ink">
            {exp.ttft_p50_ms != null ? `${exp.ttft_p50_ms.toFixed(0)} ms` : "—"} /{" "}
            {exp.latency_p99_ms != null ? `${exp.latency_p99_ms.toFixed(0)} ms` : "—"}
          </dd>
        </div>
      </dl>

      {exp.error_message && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {exp.error_message}
        </div>
      )}

      {exp.status === "queued" && (
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Waiting for your local agent. Run{" "}
          <Link href="/app/connect" className="font-medium underline">
            Connect agent
          </Link>{" "}
          then <code className="rounded bg-white/80 px-1">xariv-pulse agent</code>.
        </div>
      )}

      {exp.result_payload && (
        <pre className="mt-6 overflow-x-auto rounded-xl bg-code-block-bg p-4 text-xs text-code-block-fg">
          {JSON.stringify(exp.result_payload, null, 2)}
        </pre>
      )}
    </div>
  );
}
