interface Props { label: string; value: string; sub?: string; tone?: "ok" | "warn" | "default"; }

export default function MetricCard({ label, value, sub, tone = "default" }: Props) {
  const ring =
    tone === "ok" ? "ring-emerald-200" : tone === "warn" ? "ring-amber-200" : "ring-slate-200";
  const accent =
    tone === "ok" ? "text-emerald-600" : tone === "warn" ? "text-amber-600" : "text-ink";
  return (
    <div className={`rounded-2xl bg-white p-5 ring-1 ${ring} shadow-sm`}>
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`mt-1 font-display text-2xl font-bold ${accent}`}>{value}</div>
      {sub && <div className="mt-1 text-sm text-slate-500">{sub}</div>}
    </div>
  );
}
