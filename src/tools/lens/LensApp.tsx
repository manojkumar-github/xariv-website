"use client";

import { useEffect, useState } from "react";
import { getCatalog } from "@/tools/engine/catalog";
import { runSimulation } from "@/tools/engine/simulate";
import type { Catalog, DecisionReport, WorkloadSpec } from "@/tools/types";
import WorkloadForm from "@/tools/lens/components/WorkloadForm";
import ReportView from "@/tools/lens/components/ReportView";
import { ToolChrome } from "@/tools/ToolChrome";

const STAGES = ["Workload", "Knowledge", "Prediction", "Explainability", "Report"];

export default function LensApp() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [report, setReport] = useState<DecisionReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCatalog(getCatalog());
  }, []);

  function onSubmit(spec: WorkloadSpec) {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      try {
        setReport(runSimulation(spec));
      } catch (e) {
        setError(String(e));
      } finally {
        setLoading(false);
      }
    }, 10);
  }

  return (
    <ToolChrome product="Lens" stages={STAGES}>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-tool-ink">
            Predict cost, performance, and bottlenecks before you deploy.
          </h1>
          <p className="mt-2 text-slate-600">
            Describe an AI inference workload and XARIV simulates how it will behave on real
            hardware — sizing, economics, and the binding constraint, with the reasoning behind
            every number.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          {catalog ? (
            <WorkloadForm catalog={catalog} loading={loading} onSubmit={onSubmit} />
          ) : (
            <div className="text-slate-400">Loading catalog…</div>
          )}
          <div>
            {report ? (
              <ReportView r={report} />
            ) : (
              <div className="grid h-full place-items-center rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center text-slate-400">
                Describe a workload and run a prediction to see the decision report.
              </div>
            )}
          </div>
        </div>
      </main>
    </ToolChrome>
  );
}
