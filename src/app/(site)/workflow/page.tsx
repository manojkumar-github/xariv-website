import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PlatformDiagram } from "@/components/brand/PlatformDiagram";
import { CapabilityGrid } from "@/components/platform/CapabilityGrid";
import { PersonaPipeline } from "@/components/platform/PersonaPipeline";
import { FragmentedComparison } from "@/components/platform/FragmentedComparison";
import { V1ExperienceFlow } from "@/components/platform/V1ExperienceFlow";
import { WorkflowSteps } from "@/components/workflow/WorkflowSteps";
import {
  platformPositioning,
  platformCapabilities,
  enterpriseLifecycle,
  v1Experience,
} from "@/data/platform";
import { workflowSteps, workflowRoles } from "@/data/workflow";
import { caseStudy } from "@/data/social-proof";

export const metadata: Metadata = {
  title: "Workflow",
  description:
    "XARIV platform workflow — define, benchmark, analyze, and decide on AI infrastructure in under 10 minutes.",
};

export default function WorkflowPage() {
  return (
    <Section className="pt-16">
      <p className="text-sm font-medium uppercase tracking-widest text-muted">
        {platformPositioning.category}
      </p>
      <h1 className="mt-4 font-display text-3xl font-medium text-ink md:text-4xl">
        Platform workflow
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-soft">{platformPositioning.subhead}</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/lens">Define workload</Button>
        <Button href="/tools" variant="secondary">
          Quick calculators
        </Button>
      </div>

      <div className="mt-12 rounded-lg border border-line bg-surface p-3">
        <PlatformDiagram className="h-auto w-full" />
      </div>

      {/* 10-min experience */}
      <div className="mt-16">
        <h2 className="font-display text-xl font-medium text-ink">
          Complete in under 10 minutes
        </h2>
        <p className="mt-2 text-sm text-muted">
          The v1 experience every engineer can finish today — no account required.
        </p>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <V1ExperienceFlow />
          <div className="space-y-3">
            {v1Experience.map((s) => (
              <div
                key={s.step}
                className="flex items-center justify-between rounded-lg border border-line bg-canvas px-4 py-3 text-sm"
              >
                <span className="text-ink-soft">
                  <span className="font-medium text-ink">{s.step}.</span> {s.title}
                </span>
                <span className="text-xs text-muted">{s.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full guided path */}
      <div className="mt-16 rounded-lg border border-line bg-surface p-6 md:p-10">
        <h2 className="font-display text-xl font-medium text-ink">Detailed guided path</h2>
        <p className="mt-2 text-sm text-muted">
          Includes optional calculators (step 0) before the core platform workflow.
        </p>
        <div className="mt-10">
          <WorkflowSteps steps={workflowSteps} />
        </div>
      </div>

      {/* Unified report anchor */}
      <div id="report" className="mt-16 rounded-lg border border-accent/30 bg-surface p-6 md:p-8">
        <p className="text-xs font-medium uppercase tracking-wider text-accent">
          Step 3 · Analyze
        </p>
        <h2 className="mt-2 font-display text-xl font-medium text-ink">
          Unified performance report
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-ink-soft">
          Lens provides sizing, cost, bottleneck classification, and ranked recommendations.
          Pulse adds latency percentiles and GPU telemetry. Together they form the evidence
          layer for your architecture decision — the report your team approves before
          procurement.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/lens">Open Lens report</Button>
          <Button href="/pulse" variant="secondary">
            Open Pulse profile
          </Button>
        </div>
      </div>

      {/* Example */}
      <div className="mt-16">
        <h2 className="font-display text-xl font-medium text-ink">Example: 48 → 31 GPUs</h2>
        <p className="mt-2 text-sm text-ink-soft">{caseStudy.result}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-5">
          {workflowSteps.map((s) => (
            <Card key={s.id} href={s.href} className="flex flex-col">
              <p className="text-xs font-medium uppercase text-muted">
                {s.step} · {s.phase}
              </p>
              <p className="mt-2 flex-1 text-sm text-ink-soft">{s.question}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Personas */}
      <div className="mt-16 border-t border-line pt-16">
        <h2 className="font-display text-xl font-medium text-ink">Cross-functional entry points</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workflowRoles.map((r) => (
            <Card key={r.role} href={r.href}>
              <p className="text-xs font-medium uppercase text-muted">Start at {r.entry}</p>
              <h3 className="mt-2 font-medium text-ink">{r.role}</h3>
              <p className="mt-1 text-sm text-muted">{r.focus}</p>
            </Card>
          ))}
        </div>
        <div className="mt-10">
          <PersonaPipeline />
        </div>
      </div>

      {/* Lifecycle + capabilities */}
      <div className="mt-16 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-lg font-medium text-ink">Enterprise lifecycle</h2>
          <ul className="mt-4 space-y-3">
            {enterpriseLifecycle.map((p) => (
              <li key={p.phase} className="flex items-center justify-between text-sm">
                <span className="text-ink-soft">{p.phase}</span>
                <Link href={p.href} className="text-accent hover:underline">
                  {p.module}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-lg font-medium text-ink">Platform capabilities</h2>
          <div className="mt-4">
            <CapabilityGrid capabilities={platformCapabilities} />
          </div>
        </div>
      </div>

      <div className="mt-16">
        <FragmentedComparison />
      </div>
    </Section>
  );
}
