import type { DecisionReport } from "@/tools/types";
import MetricCard from "./MetricCard";

const usd = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(n >= 1e6 ? 2 : 0)}${n >= 1e6 ? "M" : "K"}` : `$${n}`;

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
        <span className="text-slate-600">{label}</span>
        <span className={binding ? "font-semibold text-brand" : "text-slate-500"}>{pct}%</span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-slate-100">
        <div
          className="h-2 rounded-full"
          style={{
            width: `${Math.min(pct, 100)}%`,
            background: binding ? "linear-gradient(90deg,#4f46e5,#06b6d4)" : "#cbd5e1",
          }}
        />
      </div>
    </div>
  );
}

export default function ReportView({ r }: { r: DecisionReport }) {
  const u = r.utilization;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="GPUs needed" value={`${r.gpus_needed}`} sub={`${r.gpus_per_replica}/replica × ${r.replicas}`} />
        <MetricCard label="Monthly cost" value={usd(r.monthly_cost_usd)} sub={`$${r.cost_per_million_requests_usd}/1M req · ${r.power_kw} kW`} />
        <MetricCard label="TTFT" value={`${r.ttft_ms} ms`} sub={`p99 SLO ${r.meets_slo ? "met" : "at risk"}`} tone={r.meets_slo ? "ok" : "warn"} />
        <MetricCard label="Decode throughput" value={`${r.decode_tps_per_request} t/s`} sub={`per request · ${r.aggregate_tps.toLocaleString()} t/s total`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 shadow-sm">
          <h3 className="font-display text-lg font-semibold">Predicted bottleneck</h3>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-brand">
            {BOTTLENECK_LABEL[r.bottleneck.kind] ?? r.bottleneck.kind}
          </div>
          <p className="mt-3 text-sm text-slate-600">{r.bottleneck.detail}</p>
          <div className="mt-5 space-y-3">
            <Bar label="HBM capacity" pct={u.mem_capacity_pct} />
            <Bar label="Memory bandwidth" pct={u.mem_bandwidth_pct} />
            <Bar label="Compute" pct={u.compute_pct} />
            <Bar label="Network" pct={u.network_pct} />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 shadow-sm">
          <h3 className="font-display text-lg font-semibold">Recommended actions</h3>
          <ul className="mt-3 space-y-3">
            {r.recommendations.map((rec, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-700">
                <span className="mt-0.5 text-brand">→</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <details className="rounded-2xl bg-white p-5 ring-1 ring-slate-200">
        <summary className="cursor-pointer text-sm font-medium text-slate-600">Modeling assumptions</summary>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-500">
          {r.assumptions.map((a, i) => <li key={i}>{a}</li>)}
        </ul>
      </details>
    </div>
  );
}
