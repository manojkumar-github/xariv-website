import type { DecisionReport } from "@/tools/types";
import { toolBadge, toolCard } from "@/components/tools/styles";
import MetricCard from "./MetricCard";

const usd = (n: number) =>
  n >= 1000
    ? `$${(n / 1000).toFixed(n >= 1e6 ? 2 : 0)}${n >= 1e6 ? "M" : "K"}`
    : `$${n}`;

const BOTTLENECK_LABEL: Record<string, string> = {
  mem_capacity: "HBM Capacity",
  mem_bandwidth: "Memory Bandwidth",
  compute: "Compute (FLOPs)",
  network: "Network / Collectives",
};

function Bar({ label, pct }: { label: string; pct: number }) {
  const binding = pct >= 99.5;
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="text-ink-soft">{label}</span>
        <span className={binding ? "font-medium text-accent" : "text-muted"}>{pct}%</span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-line">
        <div
          className={`h-2 rounded-full ${binding ? "bg-accent" : "bg-muted/40"}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}

export default function ReportView({ r }: { r: DecisionReport }) {
  const u = r.utilization;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <MetricCard
          label="GPUs needed"
          value={`${r.gpus_needed}`}
          sub={`${r.gpus_per_replica}/replica × ${r.replicas}`}
        />
        <MetricCard
          label="Monthly cost"
          value={usd(r.monthly_cost_usd)}
          sub={`$${r.cost_per_million_requests_usd}/1M req · ${r.power_kw} kW`}
        />
        <MetricCard
          label="TTFT"
          value={`${r.ttft_ms} ms`}
          sub={`p99 SLO ${r.meets_slo ? "met" : "at risk"}`}
          tone={r.meets_slo ? "ok" : "warn"}
        />
        <MetricCard
          label="Decode throughput"
          value={`${r.decode_tps_per_request} t/s`}
          sub={`per request · ${r.aggregate_tps.toLocaleString()} t/s total`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className={toolCard}>
          <h3 className="font-display text-lg font-medium text-ink">Predicted bottleneck</h3>
          <div className={`mt-3 ${toolBadge}`}>
            {BOTTLENECK_LABEL[r.bottleneck.kind] ?? r.bottleneck.kind}
          </div>
          <p className="mt-3 text-sm text-ink-soft">{r.bottleneck.detail}</p>
          <div className="mt-5 space-y-3">
            <Bar label="HBM capacity" pct={u.mem_capacity_pct} />
            <Bar label="Memory bandwidth" pct={u.mem_bandwidth_pct} />
            <Bar label="Compute" pct={u.compute_pct} />
            <Bar label="Network" pct={u.network_pct} />
          </div>
        </div>

        <div className={toolCard}>
          <h3 className="font-display text-lg font-medium text-ink">Recommended actions</h3>
          <ul className="mt-3 space-y-3">
            {r.recommendations.map((rec, i) => (
              <li key={i} className="flex gap-3 text-sm text-ink-soft">
                <span className="mt-0.5 text-accent">—</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <details className={`${toolCard} cursor-pointer`}>
        <summary className="text-sm font-medium text-ink-soft">Modeling assumptions</summary>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
          {r.assumptions.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}
