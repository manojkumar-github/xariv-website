import Link from "next/link";
import type { ExperimentSummary } from "@/lib/pulse-api";

const STATUS_STYLES: Record<string, string> = {
  queued: "bg-amber-50 text-amber-800 border-amber-200",
  claimed: "bg-sky-50 text-sky-800 border-sky-200",
  running: "bg-indigo-50 text-indigo-800 border-indigo-200",
  succeeded: "bg-emerald-50 text-emerald-800 border-emerald-200",
  failed: "bg-red-50 text-red-800 border-red-200",
  cancelled: "bg-zinc-100 text-zinc-600 border-zinc-200",
};

function fmt(n: number | null | undefined, digits = 1) {
  if (n == null || Number.isNaN(n)) return "—";
  return n.toFixed(digits);
}

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export function ExperimentsTable({ rows }: { rows: ExperimentSummary[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-surface p-10 text-center">
        <p className="text-ink-soft">No experiments yet.</p>
        <Link
          href="/app/experiments/new"
          className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
        >
          Queue your first local benchmark →
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-surface shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-line bg-canvas-subtle text-xs uppercase tracking-wider text-muted">
          <tr>
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Model</th>
            <th className="px-4 py-3 font-semibold">Engine</th>
            <th className="px-4 py-3 font-semibold">Workload</th>
            <th className="px-4 py-3 font-semibold">TPS</th>
            <th className="px-4 py-3 font-semibold">TTFT p50</th>
            <th className="px-4 py-3 font-semibold">p99</th>
            <th className="px-4 py-3 font-semibold">Hardware</th>
            <th className="px-4 py-3 font-semibold">Created</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-line-soft last:border-0 hover:bg-canvas-subtle/60">
              <td className="px-4 py-3">
                <Link href={`/app/experiments/${r.id}`} className="font-medium text-ink hover:text-accent">
                  {r.name}
                </Link>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase ${
                    STATUS_STYLES[r.status] || STATUS_STYLES.queued
                  }`}
                >
                  {r.status}
                </span>
              </td>
              <td className="max-w-[180px] truncate px-4 py-3 text-ink-soft" title={r.model_id}>
                {r.model_id}
              </td>
              <td className="px-4 py-3 text-ink-soft">{r.engine}</td>
              <td className="px-4 py-3 text-ink-soft">{r.workload_id}</td>
              <td className="px-4 py-3 font-mono tabular-nums">{fmt(r.throughput_tps)}</td>
              <td className="px-4 py-3 font-mono tabular-nums">{fmt(r.ttft_p50_ms, 0)} ms</td>
              <td className="px-4 py-3 font-mono tabular-nums">{fmt(r.latency_p99_ms, 0)} ms</td>
              <td className="max-w-[140px] truncate px-4 py-3 text-muted" title={r.hardware_label || ""}>
                {r.hardware_label || "—"}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-muted">{fmtDate(r.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
