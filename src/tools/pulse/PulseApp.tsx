"use client";

import { useState } from "react";
import { runPulse } from "@/tools/pulse/engine/simulate";
import type { PulseReport, PulseSpec } from "@/tools/types";
import DatasetForm from "@/tools/pulse/components/DatasetForm";
import PulseResults from "@/tools/pulse/components/PulseResults";
import { ToolChrome } from "@/tools/ToolChrome";

const STAGES = ["Dataset", "Workload", "Replay", "Telemetry", "Report"];

export default function PulseApp() {
  const [report, setReport] = useState<PulseReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(spec: PulseSpec) {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      try {
        setReport(runPulse(spec));
      } catch (e) {
        setError(String(e));
      } finally {
        setLoading(false);
      }
    }, 10);
  }

  return (
    <ToolChrome product="Pulse" stages={STAGES}>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-tool-ink">
            See the latency profile before you serve a single request.
          </h1>
          <p className="mt-2 text-slate-600">
            Point Pulse at a public dataset like ShareGPT or paste your own prompts. It replays
            the request mix on your target GPU and summarizes TTFT, ITL, TPOT, end-to-end latency,
            throughput, and live-style GPU telemetry.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <DatasetForm loading={loading} onSubmit={onSubmit} />
          <div>
            {report ? (
              <PulseResults r={report} />
            ) : (
              <div className="grid h-full place-items-center rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center text-slate-400">
                Choose a dataset and hardware, then run a profile to see the inference metrics.
              </div>
            )}
          </div>
        </div>
      </main>
    </ToolChrome>
  );
}
