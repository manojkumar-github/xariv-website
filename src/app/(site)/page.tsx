import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { HeroCodePanel } from "@/components/brand/HeroCodePanel";
import { MetricStrip } from "@/components/brand/MetricStrip";
import { PlatformDiagram } from "@/components/brand/PlatformDiagram";
import { CapabilityGrid } from "@/components/platform/CapabilityGrid";
import { PersonaPipeline } from "@/components/platform/PersonaPipeline";
import { FragmentedComparison } from "@/components/platform/FragmentedComparison";
import { ScenarioCards } from "@/components/platform/ScenarioCards";
import { WorkflowStepCards } from "@/components/workflow/WorkflowStepCards";
import { XarivMark } from "@/components/brand/Logo";
import { architectureStudies } from "@/data/architecture-studies";
import {
  platformPositioning,
  customerProblems,
  platformCapabilities,
  enterpriseLifecycle,
} from "@/data/platform";
import {
  caseStudy,
  customerLogos,
  testimonial,
} from "@/data/social-proof";
import { site } from "@/lib/constants";

export default function HomePage() {
  const featuredStudies = architectureStudies.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="animate-fade-in bg-hero-gradient pt-16 md:pt-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs text-ink-soft shadow-sm">
                <XarivMark size={16} />
                <span>XARIV Labs</span>
                <span className="text-muted">·</span>
                <span className="text-muted">Engineering control plane</span>
              </div>
              <h1 className="mt-8 text-4xl font-semibold leading-[1.08] tracking-tight text-ink md:text-5xl lg:text-[3.25rem]">
                {platformPositioning.headline}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-ink-soft md:text-xl md:leading-relaxed">
                {platformPositioning.subhead}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/workflow" size="lg">
                  Start 10-minute workflow
                </Button>
                <Button href="/lens" variant="secondary" size="lg">
                  Define a workload
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted">No account required · Free to start</p>
            </div>
            <HeroCodePanel />
          </div>
        </div>
      </section>

      {/* Proof metrics */}
      <Section className="!py-12 md:!py-16">
        <MetricStrip />
      </Section>

      {/* Scenario cards — Kitaru-style "same move" */}
      <Section className="border-t border-line bg-canvas-subtle">
        <Eyebrow>One workload. A different question each time.</Eyebrow>
        <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          Change one variable. See what would happen.
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-ink-soft">
          Define a workload once in Lens. Swap models, scale traffic, or change hardware —
          get a decision report without rerunning production.
        </p>
        <div className="mt-10">
          <ScenarioCards />
        </div>
      </Section>

      {/* Customer problems */}
      <Section>
        <Eyebrow>Sound familiar?</Eyebrow>
        <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          Engineers don&apos;t wake up needing a KV cache calculator
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {customerProblems.map((p) => (
            <div
              key={p.quote}
              className="rounded-xl border border-line bg-surface p-6 shadow-sm"
            >
              <p className="text-lg font-medium leading-snug text-ink">
                &ldquo;{p.quote}&rdquo;
              </p>
              <p className="mt-3 text-sm text-muted">{p.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Platform capabilities */}
      <Section className="border-t border-line bg-canvas-subtle">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Eyebrow>Powered by the control plane</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              {platformPositioning.oneLiner}
            </h2>
            <p className="mt-4 text-lg text-ink-soft">
              Lens, Pulse, Atlas, Oracle, and Forge are modules inside one engineering
              control plane — not five unrelated products.
            </p>
            <div className="mt-8">
              <Button href="/products">Explore platform modules</Button>
            </div>
          </div>
          <div className="rounded-xl border border-line bg-surface p-4 shadow-sm">
            <PlatformDiagram className="h-auto w-full" />
          </div>
        </div>
        <div className="mt-12">
          <CapabilityGrid capabilities={platformCapabilities} />
        </div>
      </Section>

      {/* 3-step workflow */}
      <Section>
        <Eyebrow>The decision workflow</Eyebrow>
        <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          From workload sketch to procurement-ready decision
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-ink-soft">
          Define, benchmark, analyze — complete in under 10 minutes. Calculators are
          optional step zero for quick ballpark checks.
        </p>
        <div className="mt-12">
          <WorkflowStepCards />
        </div>
        <div className="mt-10">
          <Button href="/workflow">Open guided workflow</Button>
        </div>
      </Section>

      {/* Fragmented vs XARIV */}
      <Section className="border-t border-line bg-canvas-subtle">
        <Eyebrow>Replace the fragmented stack</Eyebrow>
        <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          Twelve tools. No single source of truth.
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-ink-soft">
          Every step of the AI infrastructure lifecycle uses a different tool. XARIV owns
          the decision workflow between them.
        </p>
        <div className="mt-10">
          <FragmentedComparison />
        </div>
      </Section>

      {/* Enterprise lifecycle */}
      <Section>
        <Eyebrow>Enterprise lifecycle</Eyebrow>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          Every phase of AI infrastructure, one platform
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {enterpriseLifecycle.map((phase) => (
            <Card key={phase.phase} href={phase.href} className="flex flex-col">
              <div className="flex items-center justify-between gap-2">
                <p className="eyebrow">{phase.phase}</p>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                    phase.status === "live"
                      ? "bg-accent-muted text-accent"
                      : "border border-dashed border-line text-muted"
                  }`}
                >
                  {phase.status}
                </span>
              </div>
              <p className="mt-3 flex-1 text-sm text-ink-soft">{phase.question}</p>
              <p className="mt-4 text-xs font-semibold text-accent">{phase.module}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Cross-functional personas */}
      <Section className="border-t border-line bg-canvas-subtle">
        <Eyebrow>Built for cross-functional teams</Eyebrow>
        <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          One platform, multiple personas
        </h2>
        <p className="mt-4 max-w-xl text-lg text-ink-soft">
          Product, ML, platform, SRE, finance, and leadership — same source of truth.
        </p>
        <div className="mt-10">
          <PersonaPipeline />
        </div>
      </Section>

      {/* Case study */}
      <Section>
        <Eyebrow>Platform in action</Eyebrow>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          48 GPUs → 31 GPUs
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-ink-soft">
          <span className="font-medium text-ink">{caseStudy.customer}.</span>{" "}
          {caseStudy.problem} {caseStudy.solution} {caseStudy.result}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/workflow">Walk through this example</Button>
          <Button href="/lens" variant="secondary">
            Try Lens
          </Button>
        </div>
        <blockquote className="mt-12 max-w-2xl rounded-xl border border-line bg-canvas-subtle p-6">
          <p className="text-lg leading-relaxed text-ink-soft">
            &ldquo;{testimonial.quote}&rdquo;
          </p>
          <footer className="mt-4 text-sm text-muted">
            — {testimonial.author}, {testimonial.company}
          </footer>
        </blockquote>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          {customerLogos.map((c) => (
            <div key={c.name} className="flex items-center gap-2 text-sm text-muted">
              <XarivMark size={18} className="opacity-30" />
              <span>{c.name}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Architecture Studies */}
      <Section className="border-t border-line bg-canvas-subtle">
        <Eyebrow>From the blog</Eyebrow>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          Architecture Studies
        </h2>
        <p className="mt-4 max-w-lg text-lg text-ink-soft">
          First-principles engineering analysis behind the platform models.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
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
        <a
          href="/architecture-studies"
          className="mt-8 inline-block text-sm font-medium text-accent hover:underline"
        >
          All architecture studies →
        </a>
      </Section>

      {/* Final CTA */}
      <section className="bg-cta-gradient py-20 md:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            {site.tagline}
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Start with a workload definition. Complete the workflow in under 10 minutes.
            Export when your team is ready to decide.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/lens"
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-medium text-accent shadow-sm transition-opacity hover:opacity-90"
            >
              Define a workload
            </Link>
            <Button href="/contact?intent=demo" variant="inverse" size="lg">
              Book demo
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
