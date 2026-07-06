import { fragmentedStack } from "@/data/platform";

export function FragmentedComparison() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-lg border border-line bg-surface p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          Today — fragmented
        </p>
        <ul className="mt-4 space-y-3">
          {fragmentedStack.map((row) => (
            <li key={row.step} className="flex justify-between gap-4 text-sm">
              <span className="text-ink-soft">{row.step}</span>
              <span className="text-right text-muted">{row.tool}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs text-muted">
          Nobody owns the entire engineering decision workflow.
        </p>
      </div>
      <div className="rounded-lg border border-accent/30 bg-surface p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-accent">
          With XARIV — one platform
        </p>
        <ul className="mt-4 space-y-3 text-sm text-ink-soft">
          <li className="flex gap-2">
            <span className="text-accent">—</span>
            Define workload once, reuse across planning and benchmarking
          </li>
          <li className="flex gap-2">
            <span className="text-accent">—</span>
            Unified performance report with bottleneck explainability
          </li>
          <li className="flex gap-2">
            <span className="text-accent">—</span>
            Ranked optimization recommendations, not raw metrics
          </li>
          <li className="flex gap-2">
            <span className="text-accent">—</span>
            Exportable decision report for cross-functional approval
          </li>
          <li className="flex gap-2">
            <span className="text-accent">—</span>
            Forecasting and simulation as platform modules (roadmap)
          </li>
        </ul>
      </div>
    </div>
  );
}
