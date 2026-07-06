import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { WorkflowSteps } from "@/components/workflow/WorkflowSteps";
import { workflowSteps, workflowTagline, workflowRoles } from "@/data/workflow";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "XARIV documentation — Estimate, Plan, Validate, and Justify AI infrastructure before GPU procurement.",
};

const productDocs = [
  { label: "XARIV Lens — Plan", href: "/products/lens" },
  { label: "XARIV Pulse — Validate", href: "/products/pulse" },
  { label: "XARIV Atlas (waitlist)", href: "/products/atlas" },
];

const calculatorDocs = [
  { label: "All calculators (Step 0)", href: "/tools" },
  { label: "KV Cache calculator", href: "/tools/kv-cache" },
  { label: "GPU memory calculator", href: "/tools/gpu-memory" },
  { label: "GPU count estimator", href: "/tools/gpu-count" },
  { label: "Eco impact rating", href: "/tools/eco-impact" },
];

const referenceDocs = [
  { label: "Guided workflow", href: "/workflow" },
  { label: "Architecture studies", href: "/architecture-studies" },
  { label: "Open source", href: "/open-source" },
  { label: "GitHub", href: "https://github.com/xariv-labs", external: true },
];

export default function DocsPage() {
  return (
    <Section className="pt-16">
      <p className="text-sm font-medium uppercase tracking-widest text-muted">Documentation</p>
      <h1 className="mt-4 font-display text-3xl font-medium text-ink md:text-4xl">Docs</h1>
      <p className="mt-4 max-w-2xl text-ink-soft">{workflowTagline}</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/workflow">Guided workflow</Button>
        <Button href="/tools" variant="secondary">
          Step 0 — Calculators
        </Button>
      </div>

      {/* Workflow overview */}
      <div id="workflow" className="mt-16 rounded-lg border border-line bg-surface p-6 md:p-10">
        <h2 className="font-display text-xl font-medium text-ink">
          Estimate → Plan → Validate → Justify
        </h2>
        <p className="mt-2 text-sm text-muted">
          The enterprise workflow for AI infrastructure decisions. Start at Step 0 or enter
          at the phase that matches your role.
        </p>
        <div className="mt-10">
          <WorkflowSteps steps={workflowSteps} compact />
        </div>
        <Link
          href="/workflow"
          className="mt-8 inline-block text-sm font-medium text-accent hover:underline"
        >
          Full guided workflow with example walkthrough →
        </Link>
      </div>

      {/* Step 0 callout */}
      <div id="estimate" className="mt-12 rounded-lg border border-accent/30 bg-surface p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-accent">
          Step 0 · Estimate
        </p>
        <h2 className="mt-2 font-display text-lg font-medium text-ink">
          Start with calculators
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Before opening Lens or Pulse, run quick calculators to confirm your workload is in
          the right ballpark — KV cache size, GPU memory, rough cost, and carbon intensity.
          Each takes under 30 seconds.
        </p>
        <Link href="/tools" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
          Open calculators →
        </Link>
      </div>

      {/* Role entry points */}
      <div className="mt-12">
        <h2 className="font-display text-lg font-medium text-ink">Enter by role</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {workflowRoles.map((r) => (
            <Card key={r.role} href={r.href}>
              <p className="text-xs font-medium uppercase text-muted">Start at {r.entry}</p>
              <h3 className="mt-1 font-medium text-ink">{r.role}</h3>
              <p className="mt-1 text-sm text-muted">{r.focus}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Reference sections */}
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <Card>
          <h2 className="font-display text-lg font-medium text-ink">Products</h2>
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
        <Card>
          <h2 className="font-display text-lg font-medium text-ink">Reference</h2>
          <ul className="mt-4 space-y-2">
            {referenceDocs.map((link) => (
              <li key={link.label}>
                {"external" in link && link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-accent hover:underline"
                  >
                    {link.label} →
                  </a>
                ) : (
                  <Link href={link.href} className="text-sm text-accent hover:underline">
                    {link.label} →
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </Section>
  );
}
