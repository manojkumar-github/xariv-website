import { outcomes } from "@/data/social-proof";

export function MetricStrip() {
  return (
    <div className="rounded-xl border border-line bg-surface p-6 shadow-sm md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
        <div>
          <p className="font-mono text-xs text-muted">case study · h100 chat rollout</p>
          <p className="mt-1 text-sm font-medium text-ink">Spreadsheet estimate → XARIV model</p>
        </div>
        <span className="rounded-full bg-accent-muted px-3 py-1 text-xs font-semibold text-accent">
          −35% GPUs
        </span>
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        <div>
          <p className="text-sm text-muted">GPU count</p>
          <p className="mt-1 text-2xl font-semibold text-ink">
            <span className="text-muted line-through">48</span>{" "}
            <span className="text-gradient">31</span>
          </p>
        </div>
        <div>
          <p className="text-sm text-muted">p99 latency</p>
          <p className="mt-1 text-2xl font-semibold text-ink">
            480<span className="text-base font-normal text-muted">ms</span>
          </p>
          <p className="text-xs text-muted">SLO 500ms met</p>
        </div>
        <div>
          <p className="text-sm text-muted">capex saved</p>
          <p className="mt-1 text-2xl font-semibold text-gradient">35%</p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 border-t border-line pt-6 sm:grid-cols-3">
        {outcomes.map((o) => (
          <div key={o.label}>
            <p className="text-xl font-semibold text-accent">{o.value}</p>
            <p className="mt-0.5 text-sm font-medium text-ink">{o.label}</p>
            <p className="mt-0.5 text-xs text-muted">{o.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
