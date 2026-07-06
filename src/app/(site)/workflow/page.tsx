import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { WorkflowSteps } from "@/components/workflow/WorkflowSteps";
import {
  workflowSteps,
  workflowTagline,
  workflowRoles,
} from "@/data/workflow";
import { caseStudy } from "@/data/social-proof";

export const metadata: Metadata = {
  title: "Workflow",
  description:
    "XARIV enterprise workflow — Estimate, Plan, Validate, and Justify AI infrastructure before GPU procurement.",
};

export default function WorkflowPage() {
  return (
    <Section className="pt-16">
      <Link href="/docs" className="text-sm text-muted hover:text-ink">
        ← Docs
      </Link>

      <p className="mt-8 text-sm font-medium uppercase tracking-widest text-muted">
        Enterprise workflow
      </p>
      <h1 className="mt-4 font-display text-3xl font-medium text-ink md:text-4xl">
        Estimate → Plan → Validate → Justify
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-soft">{workflowTagline}</p>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        One continuous decision chain from quick calculator checks to a procurement-ready
        infrastructure report. No account required for steps 0–2.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/tools">Start — Estimate</Button>
        <Button href="/lens" variant="secondary">
          Skip to Plan
        </Button>
      </div>

      {/* Guided steps */}
      <div className="mt-16 rounded-lg border border-line bg-surface p-6 md:p-10">
        <h2 className="font-display text-xl font-medium text-ink">Guided path</h2>
        <p className="mt-2 text-sm text-muted">
          Follow each step in order, or enter at the stage that matches your role.
        </p>
        <div className="mt-10">
          <WorkflowSteps steps={workflowSteps} />
        </div>
      </div>

      {/* Example walkthrough */}
      <div className="mt-16">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          Example walkthrough
        </p>
        <h2 className="mt-3 font-display text-2xl font-medium text-ink">
          48 GPUs → 31 GPUs
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <Card className="flex flex-col">
            <p className="text-xs font-medium uppercase text-muted">0 · Estimate</p>
            <p className="mt-2 flex-1 text-sm text-ink-soft">
              GPU memory calculator showed 32B model + 2K context needs ~24 GB/GPU at FP8.
            </p>
            <Link href="/tools/gpu-memory" className="mt-4 text-sm text-accent hover:underline">
              GPU memory calc →
            </Link>
          </Card>
          <Card className="flex flex-col">
            <p className="text-xs font-medium uppercase text-muted">1 · Plan</p>
            <p className="mt-2 flex-1 text-sm text-ink-soft">
              Lens predicted memory-bandwidth bottleneck — 28 GPUs minimum for 1K QPS.
            </p>
            <Link href="/lens" className="mt-4 text-sm text-accent hover:underline">
              Try Lens →
            </Link>
          </Card>
          <Card className="flex flex-col">
            <p className="text-xs font-medium uppercase text-muted">2 · Validate</p>
            <p className="mt-2 flex-1 text-sm text-ink-soft">
              Pulse replayed ShareGPT — p99 412ms at 31 GPUs with tensor parallelism.
            </p>
            <Link href="/pulse" className="mt-4 text-sm text-accent hover:underline">
              Run Pulse →
            </Link>
          </Card>
          <div id="justify">
            <Card className="flex h-full flex-col border-accent/30">
              <p className="text-xs font-medium uppercase text-accent">3 · Justify</p>
              <p className="mt-2 flex-1 text-sm text-ink-soft">{caseStudy.result}</p>
              <Link
                href="/contact?intent=report"
                className="mt-4 text-sm text-accent hover:underline"
              >
                Get decision report →
              </Link>
            </Card>
          </div>
        </div>
      </div>

      {/* Roles */}
      <div className="mt-16 border-t border-line pt-16">
        <h2 className="font-display text-xl font-medium text-ink">Enter by role</h2>
        <p className="mt-2 text-sm text-muted">
          Different stakeholders join the same workflow at different steps.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {workflowRoles.map((r) => (
            <Card key={r.role} href={r.href}>
              <p className="text-xs font-medium uppercase tracking-wider text-muted">
                Start at {r.entry}
              </p>
              <h3 className="mt-2 font-medium text-ink">{r.role}</h3>
              <p className="mt-1 text-sm text-muted">{r.focus}</p>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-16 rounded-lg border border-line bg-canvas p-8">
        <h2 className="font-display text-lg font-medium text-ink">What comes next</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Atlas (knowledge graph), Oracle (capacity planning), and Forge (infrastructure
          simulation) extend this workflow with production calibration and growth scenarios.
        </p>
        <Link href="/products" className="mt-4 inline-block text-sm text-accent hover:underline">
          View product roadmap →
        </Link>
      </div>
    </Section>
  );
}
