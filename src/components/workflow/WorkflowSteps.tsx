import Link from "next/link";
import type { WorkflowStep } from "@/data/workflow";

interface Props {
  steps: WorkflowStep[];
  /** Highlight a step by id */
  activeId?: string;
  compact?: boolean;
}

export function WorkflowSteps({ steps, activeId, compact }: Props) {
  return (
    <div className={compact ? "space-y-4" : "space-y-6"}>
      {steps.map((s, i) => {
        const active = activeId === s.id;
        return (
          <div key={s.id} className="relative flex gap-4 md:gap-6">
            {i < steps.length - 1 && (
              <span
                className="absolute left-[15px] top-10 hidden h-[calc(100%+8px)] w-px bg-line md:block"
                aria-hidden
              />
            )}
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                active
                  ? "border-accent bg-accent text-white"
                  : "border-line bg-surface text-muted"
              }`}
            >
              {s.step}
            </div>
            <div className="min-w-0 flex-1 pb-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted">
                {s.phase}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-ink">{s.title}</h3>
              {!compact && (
                <>
                  <p className="mt-1 text-sm font-medium text-accent">{s.question}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.description}</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {s.outputs.map((o) => (
                      <li
                        key={o}
                        className="rounded-md border border-line bg-canvas px-2.5 py-1 text-xs text-ink-soft"
                      >
                        {o}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Link
                  href={s.href}
                  className="text-sm font-medium text-accent hover:underline"
                >
                  {s.tool} →
                </Link>
                {!compact && s.duration && (
                  <span className="text-xs text-muted">{s.duration}</span>
                )}
                {s.nextHref && s.nextLabel && !compact && (
                  <Link
                    href={s.nextHref}
                    className="text-xs text-muted hover:text-ink"
                  >
                    {s.nextLabel}
                  </Link>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function WorkflowPills({ steps }: { steps: WorkflowStep[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {steps.map((s) => (
        <Link
          key={s.id}
          href={s.href}
          className="rounded-md border border-line bg-surface px-3 py-1.5 text-sm text-ink-soft transition-colors hover:border-accent hover:text-accent"
        >
          <span className="text-muted">{s.step}.</span> {s.phase}
        </Link>
      ))}
    </div>
  );
}
