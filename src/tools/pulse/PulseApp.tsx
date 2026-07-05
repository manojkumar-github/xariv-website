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
