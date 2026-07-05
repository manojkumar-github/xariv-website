"use client";

import { useEffect, useState } from "react";
import { ProductToolShell } from "@/components/tools/ProductToolShell";
import { toolEmpty } from "@/components/tools/styles";
import { getCatalog } from "@/tools/engine/catalog";
import { runSimulation } from "@/tools/engine/simulate";
import type { Catalog, DecisionReport, WorkloadSpec } from "@/tools/types";
import WorkloadForm from "@/tools/lens/components/WorkloadForm";
import ReportView from "@/tools/lens/components/ReportView";

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
    <ProductToolShell
      productSlug="lens"
      headline="Predict cost, performance, and bottlenecks before you deploy."
      description="Describe an AI inference workload and XARIV simulates how it will behave on real hardware — sizing, economics, and the binding constraint, with the reasoning behind every number."
      stages={STAGES}
    >
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        {catalog ? (
          <WorkloadForm catalog={catalog} loading={loading} onSubmit={onSubmit} />
        ) : (
          <div className="text-muted">Loading catalog…</div>
        )}
        <div>
          {report ? (
            <ReportView r={report} />
          ) : (
            <div className={toolEmpty}>
              Describe a workload and run a prediction to see the decision report.
            </div>
          )}
        </div>
      </div>
    </ProductToolShell>
  );
}
