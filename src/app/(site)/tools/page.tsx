import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { calculators, tierLabels, type CalculatorTier } from "@/data/calculators";
import { workflowSteps } from "@/data/workflow";

export const metadata: Metadata = {
  title: "Tools",
  description:
    "Step 0 — XARIV infrastructure calculators. Quick estimates for KV cache, GPU memory, cost, throughput, and eco impact.",
};

const tiers = [1, 2, 3, 4] as CalculatorTier[];
const estimateStep = workflowSteps[0];

export default function ToolsPage() {
  return (
    <Section className="pt-16">
      <Link href="/workflow" className="text-sm text-muted hover:text-ink">
        ← Workflow
      </Link>

      <p className="mt-8 text-xs font-medium uppercase tracking-wider text-accent">
        Step {estimateStep.step} · {estimateStep.phase}
      </p>
      <h1 className="mt-2 font-display text-3xl font-medium text-ink md:text-4xl">
        Infrastructure calculators
      </h1>
      <p className="mt-4 max-w-2xl text-ink-soft">{estimateStep.description}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {estimateStep.outputs.map((o) => (
          <span
            key={o}
            className="rounded-md border border-line bg-canvas px-2.5 py-1 text-xs text-ink-soft"
          >
            {o}
          </span>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/lens">Continue to Plan (Lens) →</Button>
        <Button href="/workflow" variant="secondary">
          View full workflow
        </Button>
      </div>

      <div className="mt-12 rounded-lg border border-line bg-surface p-5">
        <p className="text-sm text-ink-soft">
          <span className="font-medium text-ink">What&apos;s next?</span> After a quick
          estimate, continue to{" "}
          <Link href="/lens" className="text-accent hover:underline">
            Lens
          </Link>{" "}
          to predict GPU sizing and bottlenecks, then{" "}
          <Link href="/pulse" className="text-accent hover:underline">
            Pulse
          </Link>{" "}
          to validate latency on real traffic.
        </p>
      </div>

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
