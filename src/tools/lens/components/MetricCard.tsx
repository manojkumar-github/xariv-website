interface Props {
  label: string;
  value: string;
  sub?: string;
  tone?: "ok" | "warn" | "default";
}

export default function MetricCard({ label, value, sub, tone = "default" }: Props) {
  const border =
    tone === "ok"
      ? "border-emerald-200"
      : tone === "warn"
        ? "border-amber-200"
        : "border-line";
  const accent =
    tone === "ok"
      ? "text-accent"
      : tone === "warn"
        ? "text-amber-700"
        : "text-ink";

  return (
    <div className={`rounded-lg border bg-white p-5 ${border}`}>
      <div className="text-xs font-medium uppercase tracking-wide text-muted">{label}</div>
      <div className={`mt-1 font-display text-2xl font-medium tabular-nums ${accent}`}>
        {value}
      </div>
      {sub && <div className="mt-1 text-sm text-muted">{sub}</div>}
    </div>
  );
}
