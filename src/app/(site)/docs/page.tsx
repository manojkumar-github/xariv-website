import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PlatformDiagram } from "@/components/brand/PlatformDiagram";
import { CapabilityGrid } from "@/components/platform/CapabilityGrid";
import { V1ExperienceFlow } from "@/components/platform/V1ExperienceFlow";
import { PersonaPipeline } from "@/components/platform/PersonaPipeline";
import { WorkflowSteps } from "@/components/workflow/WorkflowSteps";
import {
  platformPositioning,
  platformCapabilities,
  v1Experience,
} from "@/data/platform";
import { workflowSteps, workflowRoles } from "@/data/workflow";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "XARIV platform documentation — engineering control plane for AI infrastructure decisions.",
};

const productDocs = [
  { label: "Lens — planning & explainability", href: "/products/lens" },
  { label: "Pulse — benchmarking", href: "/products/pulse" },
  { label: "Atlas — knowledge graph (waitlist)", href: "/products/atlas" },
  { label: "Oracle — capacity planning (waitlist)", href: "/products/oracle" },
  { label: "Forge — simulation (waitlist)", href: "/products/forge" },
];

const calculatorDocs = [
  { label: "All calculators (optional step 0)", href: "/tools" },
  { label: "KV Cache calculator", href: "/tools/kv-cache" },
  { label: "GPU memory calculator", href: "/tools/gpu-memory" },
  { label: "Eco impact rating", href: "/tools/eco-impact" },
];

export default function DocsPage() {
  return (
    <Section className="pt-16">
      <p className="text-sm font-medium uppercase tracking-widest text-muted">Documentation</p>
      <h1 className="mt-4 font-display text-3xl font-medium text-ink md:text-4xl">Docs</h1>
      <p className="mt-4 max-w-2xl text-ink-soft">{platformPositioning.subhead}</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/workflow">Platform workflow</Button>
        <Button href="/lens" variant="secondary">
          Define a workload
        </Button>
      </div>

      <div className="mt-12 rounded-lg border border-line bg-surface p-3">
        <PlatformDiagram className="h-auto w-full max-h-64" />
      </div>

      {/* Platform overview */}
      <div id="platform" className="mt-16">
        <h2 className="font-display text-xl font-medium text-ink">Platform overview</h2>
        <p className="mt-2 max-w-2xl text-sm text-ink-soft">
          XARIV is an engineering control plane — not a collection of disconnected calculators.
          Planning, benchmarking, explainability, optimization, and forecasting are capabilities
          inside one workflow.
        </p>
        <div className="mt-8">
          <CapabilityGrid capabilities={platformCapabilities} />
        </div>
      </div>

      {/* 10-min workflow */}
      <div id="workflow" className="mt-16 rounded-lg border border-line bg-surface p-6 md:p-10">
        <h2 className="font-display text-xl font-medium text-ink">
          10-minute workflow
        </h2>
        <p className="mt-2 text-sm text-muted">
          The v1 experience: define, benchmark, analyze, decide. Calculators are optional step 0.
        </p>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <V1ExperienceFlow />
          <div>
            <WorkflowSteps steps={workflowSteps} compact />
            <Link
              href="/workflow"
              className="mt-6 inline-block text-sm font-medium text-accent hover:underline"
            >
              Full workflow guide →
            </Link>
          </div>
        </div>
      </div>

      {/* Step 0 */}
      <div id="estimate" className="mt-12 rounded-lg border border-line bg-canvas p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          Optional · Step 0
        </p>
        <h2 className="mt-2 font-display text-lg font-medium text-ink">Quick calculators</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Sanity-check KV cache, GPU memory, cost, and carbon before committing to a full
          workload analysis in Lens.
        </p>
        <Link href="/tools" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
          Open calculators →
        </Link>
      </div>

      {/* Personas */}
      <div className="mt-16">
        <h2 className="font-display text-lg font-medium text-ink">Cross-functional teams</h2>
        <div className="mt-6">
          <PersonaPipeline />
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workflowRoles.map((r) => (
            <Card key={r.role} href={r.href}>
              <p className="text-xs text-muted">Start at {r.entry}</p>
              <h3 className="mt-1 font-medium text-ink">{r.role}</h3>
              <p className="mt-1 text-sm text-muted">{r.focus}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Reference */}
      <div className="mt-16 grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="font-display text-lg font-medium text-ink">Platform modules</h2>
          <ul className="mt-4 space-y-2">
            {productDocs.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-sm text-accent hover:underline">
                  {link.label} →
                </Link>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="font-display text-lg font-medium text-ink">Calculators</h2>
          <ul className="mt-4 space-y-2">
            {calculatorDocs.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-sm text-accent hover:underline">
                  {link.label} →
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </Section>
  );
}
