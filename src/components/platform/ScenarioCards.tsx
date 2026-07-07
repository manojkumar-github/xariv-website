import { infrastructureScenarios } from "@/data/scenarios";

export function ScenarioCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {infrastructureScenarios.map((s) => (
        <div
          key={s.id}
          className="rounded-xl border border-line bg-surface p-4 transition-all hover:border-accent/30 hover:shadow-md hover:shadow-accent/5"
        >
          <span className="inline-block rounded-md bg-accent-muted px-2 py-0.5 font-mono text-[11px] font-medium uppercase text-accent">
            {s.label}
          </span>
          <p className="mt-3 text-sm font-medium leading-snug text-ink">{s.question}</p>
          <code className="mt-3 block truncate rounded-md bg-code-bg px-2 py-1 font-mono text-[11px] text-ink-soft">
            {s.code}
          </code>
        </div>
      ))}
    </div>
  );
}
