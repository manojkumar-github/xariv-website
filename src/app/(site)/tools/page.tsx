import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { calculators, tierLabels, type CalculatorTier } from "@/data/calculators";

export const metadata: Metadata = {
  title: "Tools",
  description: "XARIV AI Infrastructure Calculators — quick estimators for GPU memory, cost, throughput, and more.",
};

const tiers = [1, 2, 3, 4] as CalculatorTier[];

export default function ToolsPage() {
  return (
    <Section className="pt-16">
      <p className="text-sm font-medium uppercase tracking-widest text-muted">
        XARIV AI Infrastructure Calculators
      </p>
      <h1 className="mt-4 font-display text-3xl font-medium text-ink md:text-4xl">
        Tools
      </h1>
      <p className="mt-4 max-w-2xl text-ink-soft">
        One problem, under 30 seconds. Free calculators for the questions ML
        infrastructure engineers Google every day — with links to architecture
        studies and{" "}
        <Link href="/lens" className="text-accent hover:underline">
          Lens
        </Link>{" "}
        /{" "}
        <Link href="/pulse" className="text-accent hover:underline">
          Pulse
        </Link>{" "}
        for deeper analysis.
      </p>

      {tiers.map((tier) => {
        const items = calculators.filter((c) => c.tier === tier);
        return (
          <div key={tier} className="mt-16">
            <h2 className="font-display text-xl font-medium text-ink">
              {tierLabels[tier]}
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {items.map((calc) => (
                <Card key={calc.slug} href={`/tools/${calc.slug}`}>
                  <h3 className="font-medium text-ink">{calc.name}</h3>
                  <p className="mt-2 text-sm text-muted">{calc.description}</p>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </Section>
  );
}
