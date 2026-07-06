import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { HeroDiagram } from "@/components/brand/HeroDiagram";
import { WorkflowPills } from "@/components/workflow/WorkflowSteps";
import { XarivMark } from "@/components/brand/Logo";
import { products } from "@/data/products";
import { architectureStudies } from "@/data/architecture-studies";
import { workflowSteps, workflowTagline } from "@/data/workflow";
import {
  audiences,
  caseStudy,
  customerLogos,
  outcomes,
  testimonial,
} from "@/data/social-proof";
import { site } from "@/lib/constants";

export default function HomePage() {
  const featuredStudies = architectureStudies.slice(0, 3);
  const plannedProducts = products.filter((p) => !p.appPath && p.status === "planned");

  return (
    <>
      {/* Hero */}
      <Section className="animate-fade-in pt-20 md:pt-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-muted">
              AI Infrastructure Intelligence
            </p>
            <h1 className="mt-6 font-display text-4xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl">
              Plan inference infrastructure before you provision a GPU
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft">
              {workflowTagline} Estimate with calculators, plan with Lens, validate with
              Pulse, and justify the decision to engineering and FinOps.
            </p>
            <div className="mt-6">
              <WorkflowPills steps={workflowSteps} />
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/workflow">Start the workflow</Button>
              <Button href="/tools" variant="secondary">
                Step 0 — Estimate
              </Button>
              <Button href="/contact?intent=demo" variant="secondary">
                Book demo
              </Button>
            </div>
          </div>
          <div className="rounded-lg border border-line bg-surface p-3 shadow-sm">
            <HeroDiagram className="h-auto w-full" />
          </div>
        </div>
      </Section>

      {/* Workflow — core narrative */}
      <Section className="border-t border-line bg-surface/50">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            Enterprise workflow
          </p>
          <h2 className="mt-3 font-display text-2xl font-medium text-ink md:text-3xl">
            Estimate → Plan → Validate → Justify
          </h2>
          <p className="mt-3 text-ink-soft">
            One continuous path from a 30-second calculator check to a procurement-ready
            infrastructure decision. Each step builds on the last.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {workflowSteps.map((s) => (
            <Card key={s.id} href={s.href} className="flex flex-col">
              <p className="text-xs font-medium uppercase tracking-wider text-muted">
                Step {s.step} · {s.phase}
              </p>
              <h3 className="mt-2 font-display text-lg font-medium text-ink">{s.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted">{s.question}</p>
              <p className="mt-3 text-xs text-muted">{s.duration}</p>
              <span className="mt-4 text-sm font-medium text-accent">{s.tool} →</span>
            </Card>
          ))}
        </div>
        <Link
          href="/workflow"
          className="mt-8 inline-block text-sm font-medium text-accent hover:underline"
        >
          View guided workflow →
        </Link>
      </Section>

      {/* Case study — workflow in action */}
      <Section>
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          Workflow in action
        </p>
        <h2 className="mt-3 font-display text-2xl font-medium text-ink">
          48 GPUs → 31 GPUs
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-4">
          <div className="rounded-lg border border-line bg-surface p-5">
            <p className="text-xs font-medium uppercase text-muted">0 · Estimate</p>
            <p className="mt-2 text-sm text-ink-soft">
              Calculators confirmed memory ballpark for 32B + 2K context.
            </p>
          </div>
          <div className="rounded-lg border border-line bg-surface p-5">
            <p className="text-xs font-medium uppercase text-muted">1 · Plan</p>
            <p className="mt-2 text-sm text-ink-soft">
              <span className="font-medium text-ink">{caseStudy.customer}.</span>{" "}
              {caseStudy.problem}
            </p>
          </div>
          <div className="rounded-lg border border-line bg-surface p-5">
            <p className="text-xs font-medium uppercase text-muted">2 · Validate</p>
            <p className="mt-2 text-sm text-ink-soft">{caseStudy.solution}</p>
          </div>
          <div className="rounded-lg border border-accent/30 bg-surface p-5">
            <p className="text-xs font-medium uppercase text-accent">3 · Justify</p>
            <p className="mt-2 text-sm text-ink-soft">{caseStudy.result}</p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/workflow">Walk through this example</Button>
          <Button href="/lens" variant="secondary">
            Try Lens
          </Button>
        </div>
      </Section>

      {/* Outcomes + social proof */}
      <Section className="border-t border-line bg-surface/50">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          Trusted by infrastructure teams
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {outcomes.map((o) => (
            <div key={o.label} className="rounded-lg border border-line bg-surface p-5">
              <div className="font-display text-3xl font-medium text-accent">{o.value}</div>
              <div className="mt-1 text-sm font-medium text-ink">{o.label}</div>
              <div className="mt-1 text-xs text-muted">{o.detail}</div>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          {customerLogos.map((c) => (
            <div key={c.name} className="flex items-center gap-2 text-sm text-muted">
              <XarivMark size={20} className="opacity-40" />
              <span>{c.name}</span>
            </div>
          ))}
        </div>
        <blockquote className="mt-10 max-w-2xl border-l-2 border-accent pl-6">
          <p className="text-ink-soft leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
          <footer className="mt-3 text-sm text-muted">
            — {testimonial.author}, {testimonial.company}
          </footer>
        </blockquote>
      </Section>

      {/* Who it's for — mapped to workflow steps */}
      <Section>
        <h2 className="font-display text-2xl font-medium text-ink md:text-3xl">
          Enter at the step that matches your role
        </h2>
        <p className="mt-3 max-w-xl text-ink-soft">
          Researchers, ML engineers, platform leads, and FinOps all use the same workflow —
          they just start at different steps.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((a) => (
            <Card key={a.title} href={a.href} className="flex flex-col">
              <h3 className="font-display text-lg font-medium text-ink">{a.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted">{a.problem}</p>
              <span className="mt-4 text-sm font-medium text-accent">{a.cta} →</span>
            </Card>
          ))}
        </div>
      </Section>

      {/* Roadmap products — de-emphasized */}
      {plannedProducts.length > 0 && (
        <Section className="border-t border-line bg-surface/50">
          <h2 className="font-display text-xl font-medium text-ink">Coming next</h2>
          <p className="mt-2 max-w-lg text-sm text-muted">
            Atlas, Oracle, and Forge extend the workflow with production calibration,
            capacity planning, and infrastructure simulation.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {plannedProducts.map((product) => (
              <div
                key={product.slug}
                className="flex items-center justify-between rounded-lg border border-dashed border-line bg-canvas/50 px-5 py-4"
              >
                <div>
                  <p className="font-medium text-ink">{product.name}</p>
                  <p className="text-xs text-muted">{product.tagline}</p>
                </div>
                <Link
                  href={`/contact?intent=waitlist&product=${product.slug}`}
                  className="shrink-0 text-sm font-medium text-accent hover:underline"
                >
                  Waitlist
                </Link>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Architecture Studies */}
      <Section className="border-t border-line">
        <div className="mb-10">
          <h2 className="font-display text-2xl font-medium text-ink md:text-3xl">
            Architecture Studies
          </h2>
          <p className="mt-3 max-w-lg text-ink-soft">
            Deep engineering analysis that informs the Plan and Validate steps.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featuredStudies.map((study) => (
            <ArticleCard
              key={study.slug}
              href={`/architecture-studies/${study.slug}`}
              title={study.title}
              excerpt={study.excerpt}
              date={study.date}
              category={study.category}
              readingTime={study.readingTime}
            />
          ))}
        </div>
        <Link
          href="/architecture-studies"
          className="mt-8 inline-block text-sm font-medium text-accent hover:underline"
        >
          All architecture studies →
        </Link>
      </Section>

      {/* Final CTA */}
      <Section className="border-t border-line bg-surface/50">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl font-medium text-ink">
            Start at Step 0 — Estimate
          </h2>
          <p className="mt-4 text-ink-soft leading-relaxed">
            Free calculators take under 30 seconds. When you are ready, continue through
            Plan, Validate, and Justify — no account required until you need a decision
            report.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/tools">Run calculators</Button>
            <Button href="/workflow" variant="secondary">
              Guided workflow
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
