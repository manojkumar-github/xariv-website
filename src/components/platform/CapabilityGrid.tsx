import Link from "next/link";
import type { PlatformCapability } from "@/data/platform";

export function CapabilityGrid({ capabilities }: { capabilities: PlatformCapability[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {capabilities.map((cap) => (
        <div
          key={cap.id}
          className="flex flex-col rounded-xl border border-line bg-surface p-5 shadow-sm transition-all hover:border-accent/30 hover:shadow-md hover:shadow-accent/5"
        >
          <h3 className="text-base font-semibold text-ink">{cap.name}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{cap.description}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {cap.modules.map((m) => (
              <Link
                key={m.name}
                href={m.href}
                className={`rounded-md px-2 py-0.5 text-xs ${
                  m.status === "live"
                    ? "bg-accent-muted font-semibold text-accent"
                    : "border border-dashed border-line text-muted"
                }`}
              >
                {m.name}
                {m.status === "planned" && " · soon"}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
