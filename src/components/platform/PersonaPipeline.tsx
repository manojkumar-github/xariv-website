import Link from "next/link";
import { crossFunctionalFlow } from "@/data/platform";

export function PersonaPipeline() {
  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-[640px] items-stretch gap-0">
        {crossFunctionalFlow.map((step, i) => (
          <div key={step.persona} className="flex flex-1 items-stretch">
            <div className="flex flex-1 flex-col rounded-xl border border-line bg-surface p-4 shadow-sm">
              <p className="eyebrow">{step.persona}</p>
              <p className="mt-2 flex-1 text-sm leading-snug text-ink-soft">
                &ldquo;{step.ask}&rdquo;
              </p>
              <Link
                href={step.href}
                className="mt-3 text-xs font-semibold text-accent hover:underline"
              >
                {step.action} →
              </Link>
            </div>
            {i < crossFunctionalFlow.length - 1 && (
              <div className="flex w-6 shrink-0 items-center justify-center text-muted" aria-hidden>
                →
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
