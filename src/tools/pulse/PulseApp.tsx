"use client";

import { useState } from "react";
import { ProductToolShell } from "@/components/tools/ProductToolShell";
import { toolEmpty } from "@/components/tools/styles";
import { runPulse } from "@/tools/pulse/engine/simulate";
import type { PulseReport, PulseSpec } from "@/tools/types";
import DatasetForm from "@/tools/pulse/components/DatasetForm";
import PulseResults from "@/tools/pulse/components/PulseResults";

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
    <ProductToolShell
      productSlug="pulse"
      headline="See the latency profile before you serve a single request."
      description="Point Pulse at a public dataset like ShareGPT or paste your own prompts. It replays the request mix on your target GPU and summarizes TTFT, ITL, TPOT, end-to-end latency, throughput, and live-style GPU telemetry."
      stages={STAGES}
    >
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-accent/20 bg-accent-muted/40 px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-ink">Run real benchmarks on your machine</p>
          <p className="mt-0.5 text-xs text-ink-soft">
            Queue jobs in Workspace → connect <code className="rounded bg-surface px-1">xariv-pulse</code>{" "}
            CLI → track results in your profile table.
          </p>
        </div>
        <a
          href="/app"
          className="rounded-lg bg-cta-gradient px-4 py-2 text-sm font-medium text-white"
        >
          Open workspace
        </a>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]">
        <DatasetForm loading={loading} onSubmit={onSubmit} />
        <div>
          {report ? (
            <PulseResults r={report} />
          ) : (
            <div className={toolEmpty}>
              Choose a dataset and hardware, then run a profile to see the inference metrics.
            </div>
          )}
        </div>
      </div>
    </ProductToolShell>
  );
}
