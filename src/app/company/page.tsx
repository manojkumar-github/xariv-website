import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Company",
  description: "Mission, vision, and team at XARIV.",
};

export default function CompanyPage() {
  return (
    <Section narrow className="pt-16">
      <h1 className="font-display text-3xl font-medium text-ink md:text-4xl">
        Company
      </h1>

      <div className="mt-16 space-y-16">
        <section>
          <h2 className="font-display text-xl font-medium text-ink">Mission</h2>
          <p className="mt-4 leading-relaxed text-ink-soft">
            Make AI infrastructure predictable. Teams should know what a workload
            will cost, how it will perform, and what will break — before they
            deploy hardware, not after.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-medium text-ink">Vision</h2>
          <p className="mt-4 leading-relaxed text-ink-soft">
            An infrastructure digital twin for every large-scale AI deployment —
            continuously calibrated from benchmarks, telemetry, and production
            data. The system that answers what will happen, and why.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-medium text-ink">Founder</h2>
          <p className="mt-4 leading-relaxed text-ink-soft">
            XARIV is founded by engineers who have built and operated large-scale
            inference platforms — sizing GPU fleets, debugging collective
            bottlenecks, and shipping production LLM serving at scale.
          </p>
        </section>

        <section className="rounded-lg border border-dashed border-line p-8">
          <h2 className="font-display text-xl font-medium text-ink">Careers</h2>
          <p className="mt-4 text-ink-soft">
            We are not hiring yet. When we do, we will look for infrastructure
            engineers who think in rooflines, not buzzwords.
          </p>
        </section>
      </div>
    </Section>
  );
}
