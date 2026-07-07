import Link from "next/link";
import { v1Experience } from "@/data/platform";

export function V1ExperienceFlow() {
  return (
    <div className="relative">
      {v1Experience.map((step, i) => (
        <div key={step.step} className="relative flex gap-5 pb-8 last:pb-0">
          {i < v1Experience.length - 1 && (
            <span
              className="absolute left-[19px] top-10 h-[calc(100%-16px)] w-px bg-line"
              aria-hidden
            />
          )}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cta-gradient text-sm font-semibold text-white shadow-sm">
            {step.step}
          </div>
          <div className="min-w-0 flex-1 pt-1">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold text-ink">{step.title}</h3>
              <span className="text-xs text-muted">{step.duration}</span>
            </div>
            <p className="mt-1 text-sm text-ink-soft">{step.description}</p>
            <Link href={step.href} className="mt-2 inline-block text-sm font-semibold text-accent hover:underline">
              Start →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
