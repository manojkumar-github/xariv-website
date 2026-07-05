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
    <div className={`min-w-0 rounded-lg border bg-white p-4 sm:p-5 ${border}`}>
      <div className="text-xs font-medium uppercase tracking-wide text-muted">{label}</div>
      <div
        className={`mt-1.5 break-words font-display text-xl font-medium leading-tight tabular-nums sm:text-2xl ${accent}`}
      >
        {value}
      </div>
      {sub && (
        <div className="mt-1.5 break-words text-xs leading-snug text-muted sm:text-sm">{sub}</div>
      )}
    </div>
  );
}
