import MetricCard from "@/tools/lens/components/MetricCard";
import { EcoMetricsPanel } from "@/components/tools/EcoMetricsPanel";
import { toolBadge, toolCard } from "@/components/tools/styles";
import type { MetricSummary, PulseReport } from "@/tools/types";

const ms = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(2)} s` : `${n} ms`);

function TelemetryBar({ label, pct, value }: { label: string; pct: number; value: string }) {
  const hot = pct >= 90;
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="text-ink-soft">{label}</span>
        <span className={hot ? "font-medium text-accent" : "text-muted"}>{value}</span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-line">
        <div
          className={`h-2 rounded-full ${hot ? "bg-accent" : "bg-muted/40"}`}
          style={{ width: `${Math.min(pct, 100)}%` }}
        />
      </div>
    </div>
  );
}

function PercentileRow({ name, m, unit }: { name: string; m: MetricSummary; unit?: string }) {
  const u = unit ?? " ms";
  return (
    <tr className="border-t border-line">
      <td className="py-2 pr-4 font-medium text-ink-soft">{name}</td>
      <td className="py-2 pr-4 text-right tabular-nums text-ink-soft">{m.p50}{u}</td>
      <td className="py-2 pr-4 text-right tabular-nums text-ink-soft">{m.p90}{u}</td>
      <td className="py-2 pr-4 text-right tabular-nums text-ink-soft">{m.p99}{u}</td>
      <td className="py-2 text-right tabular-nums text-muted">{m.mean}{u}</td>
    </tr>
  );
}

export default function PulseResults({ r }: { r: PulseReport }) {
  const t = r.telemetry;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <MetricCard label="TTFT (p50)" value={ms(r.ttft_ms.p50)} sub={`p99 ${ms(r.ttft_ms.p99)}`} />
        <MetricCard label="TPOT" value={`${r.tpot_ms.p50} ms`} sub="per output token" />
        <MetricCard label="ITL (p50)" value={`${r.itl_ms.p50} ms`} sub={`p99 ${r.itl_ms.p99} ms`} />
        <MetricCard
          label="End-to-end (p50)"
          value={ms(r.e2e_ms.p50)}
          sub={`p99 ${ms(r.e2e_ms.p99)}`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <MetricCard
          label="Output throughput"
          value={`${r.throughput_tps.toLocaleString()} t/s`}
          sub="aggregate decode"
        />
        <MetricCard label="Requests / sec" value={`${r.throughput_rps}`} sub="at concurrency" />
        <MetricCard
          label="Dataset"
          value={r.dataset_name}
          sub={`${r.samples.toLocaleString()} requests`}
        />
        <MetricCard
          label="Token mix (avg)"
          value={`${r.prompt_tokens_avg} / ${r.output_tokens_avg}`}
          sub="prompt / output"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className={toolCard}>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-medium text-ink">GPU telemetry</h3>
            <span className={toolBadge}>{t.regime}</span>
          </div>
          <div className="mt-4 space-y-3">
            <TelemetryBar label="SM / compute util" pct={t.sm_util_pct} value={`${t.sm_util_pct}%`} />
            <TelemetryBar
              label="Memory bandwidth util"
              pct={t.mem_bw_util_pct}
              value={`${t.mem_bw_util_pct}%`}
            />
            <TelemetryBar
              label="HBM used"
              pct={t.mem_util_pct}
              value={`${t.mem_used_gb} / ${t.mem_capacity_gb} GB`}
            />
            <TelemetryBar
              label="power_streaming"
              pct={(t.power_w / t.tdp_w) * 100}
              value={`${(t.power_w / 1000).toFixed(1)} kW`}
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border border-line bg-canvas p-3">
              <div className="text-xs uppercase tracking-wide text-muted">GPUs</div>
              <div className="font-display text-xl font-medium tabular-nums text-ink">
                {t.gpus_needed}
              </div>
            </div>
            <div className="rounded-lg border border-line bg-canvas p-3">
              <div className="text-xs uppercase tracking-wide text-muted">temperature</div>
              <div className="font-display text-xl font-medium tabular-nums text-ink">
                {r.eco.temperature}°C
              </div>
            </div>
            <div className="rounded-lg border border-line bg-canvas p-3">
              <div className="text-xs uppercase tracking-wide text-muted">power</div>
              <div className="font-display text-xl font-medium tabular-nums text-ink">
                {r.eco.power} kW
              </div>
            </div>
          </div>
        </div>

        <div className={toolCard}>
          <h3 className="font-display text-lg font-medium text-ink">Latency distribution</h3>
          <table className="mt-3 w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-muted">
                <th className="py-1 text-left font-medium">Metric</th>
                <th className="py-1 text-right font-medium">p50</th>
                <th className="py-1 text-right font-medium">p90</th>
                <th className="py-1 text-right font-medium">p99</th>
                <th className="py-1 text-right font-medium">mean</th>
              </tr>
            </thead>
            <tbody>
              <PercentileRow name="TTFT" m={r.ttft_ms} />
              <PercentileRow name="ITL" m={r.itl_ms} />
              <PercentileRow name="TPOT" m={r.tpot_ms} />
              <PercentileRow name="End-to-end" m={r.e2e_ms} />
            </tbody>
          </table>
          <p className="mt-3 text-xs text-muted">
            TTFT = time to first token · ITL = inter-token latency · TPOT = time per output
            token · E2E = full request latency.
          </p>
        </div>
      </div>

      <EcoMetricsPanel eco={r.eco} />

      <details className={`${toolCard} cursor-pointer`}>
        <summary className="text-sm font-medium text-ink-soft">
          Simulation notes & assumptions
        </summary>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
          {r.notes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}
