"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useSessionAuth } from "@/components/auth/AuthProviders";
import { pulseApi } from "@/lib/pulse-api";

const ENGINES = ["llama.cpp", "vllm", "sglang", "tgi", "tensorrt-llm", "openai"];

export default function NewExperimentPage() {
  const auth = useSessionAuth();
  const router = useRouter();
  const [workloads, setWorkloads] = useState<{ id: string; name: string }[]>([]);
  const [name, setName] = useState("Local decode benchmark");
  const [workloadId, setWorkloadId] = useState("quick-decode-v1");
  const [modelId, setModelId] = useState("");
  const [engine, setEngine] = useState("llama.cpp");
  const [inferenceUrl, setInferenceUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    pulseApi
      .listWorkloads()
      .then((d) => {
        setWorkloads(d.workloads || []);
        if (d.workloads?.[0]?.id) setWorkloadId(d.workloads[0].id);
      })
      .catch(() => {
        setWorkloads([{ id: "quick-decode-v1", name: "Quick decode" }]);
      });
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!auth.isSignedIn) return;
    setSubmitting(true);
    setError(null);
    try {
      const token = await auth.getToken();
      if (!token) throw new Error("Not signed in");
      const exp = await pulseApi.createExperiment(token, {
        name,
        workload_id: workloadId,
        model_id: modelId,
        engine,
        target: "local",
        inference_url: inferenceUrl || null,
      });
      router.push(`/app/experiments/${exp.id}`);
    } catch (err) {
      setError(String(err));
      setSubmitting(false);
    }
  }

  if (!auth.isLoaded) return <p className="text-sm text-muted">Loading…</p>;
  if (!auth.isSignedIn) {
    return (
      <p className="text-ink-soft">
        Sign in first — <Link href="/app" className="text-accent hover:underline">go to workspace</Link>
      </p>
    );
  }

  return (
    <div className="max-w-xl">
      <p className="eyebrow">New experiment</p>
      <h1 className="mt-2 text-3xl font-semibold text-ink">Queue a local benchmark</h1>
      <p className="mt-2 text-ink-soft">
        This creates a job on the control plane. Your connected CLI agent claims and runs it against
        your local inference server.
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5 rounded-xl border border-line bg-surface p-6 shadow-sm">
        <label className="block">
          <span className="text-sm font-medium text-ink">Name</span>
          <input
            className="mt-1.5 w-full rounded-lg border border-line px-3 py-2 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-ink">Workload</span>
          <select
            className="mt-1.5 w-full rounded-lg border border-line px-3 py-2 text-sm"
            value={workloadId}
            onChange={(e) => setWorkloadId(e.target.value)}
          >
            {workloads.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} ({w.id})
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-ink">Model ID</span>
          <input
            className="mt-1.5 w-full rounded-lg border border-line px-3 py-2 text-sm"
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
            placeholder="e.g. Llama-3.2-3B-Instruct"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-ink">Engine</span>
          <select
            className="mt-1.5 w-full rounded-lg border border-line px-3 py-2 text-sm"
            value={engine}
            onChange={(e) => setEngine(e.target.value)}
          >
            {ENGINES.map((eng) => (
              <option key={eng} value={eng}>
                {eng}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-ink">Inference URL (optional)</span>
          <input
            className="mt-1.5 w-full rounded-lg border border-line px-3 py-2 text-sm"
            value={inferenceUrl}
            onChange={(e) => setInferenceUrl(e.target.value)}
            placeholder="http://localhost:8080/v1/completions"
          />
        </label>

        <div className="rounded-lg bg-canvas-subtle p-3 text-xs text-muted">
          Target: <strong className="text-ink">Local machine</strong> · Ensure{" "}
          <code className="rounded bg-code-bg px-1">xariv-pulse agent</code> is running after you
          connect.
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-cta-gradient px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {submitting ? "Queueing…" : "Queue experiment"}
        </button>
      </form>
    </div>
  );
}
