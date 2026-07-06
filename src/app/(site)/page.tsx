import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { PlatformDiagram } from "@/components/brand/PlatformDiagram";
import { CapabilityGrid } from "@/components/platform/CapabilityGrid";
import { PersonaPipeline } from "@/components/platform/PersonaPipeline";
import { FragmentedComparison } from "@/components/platform/FragmentedComparison";
import { V1ExperienceFlow } from "@/components/platform/V1ExperienceFlow";
import { XarivMark } from "@/components/brand/Logo";
import { architectureStudies } from "@/data/architecture-studies";
import {
  platformPositioning,
  customerProblems,
  platformCapabilities,
  enterpriseLifecycle,
} from "@/data/platform";
import { workflowSteps } from "@/data/workflow";
import {
  caseStudy,
  customerLogos,
  outcomes,
  testimonial,
} from "@/data/social-proof";
import { site } from "@/lib/constants";

export default function HomePage() {
  const featuredStudies = architectureStudies.slice(0, 3);

  return (
    <>
      {/* Hero — problem-first, platform positioning */}
      <Section className="animate-fade-in pt-20 md:pt-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-muted">
              {platformPositioning.category}
            </p>
            <h1 className="mt-6 font-display text-4xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl">
              {platformPositioning.headline}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft">
              {platformPositioning.subhead}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/workflow">Start 10-minute workflow</Button>
              <Button href="/lens" variant="secondary">
                Define a workload
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted">No account required · Free to start</p>
          </div>
          <div className="rounded-lg border border-line bg-surface p-3 shadow-sm">
            <PlatformDiagram className="h-auto w-full" />
          </div>
        </div>
      </Section>

      {/* Customer problems */}
      <Section className="border-t border-line bg-surface/50">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          Sound familiar?
        </p>
        <h2 className="mt-3 font-display text-2xl font-medium text-ink md:text-3xl">
          Engineers don&apos;t wake up needing a KV cache calculator
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {customerProblems.map((p) => (
            <div key={p.quote} className="rounded-lg border border-line bg-surface p-6">
              <p className="font-display text-lg font-medium leading-snug text-ink">
                &ldquo;{p.quote}&rdquo;
              </p>
              <p className="mt-3 text-sm text-muted">{p.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Platform capabilities */}
      <Section>
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            One platform · Five capabilities
          </p>
          <h2 className="mt-3 font-display text-2xl font-medium text-ink md:text-3xl">
            {platformPositioning.oneLiner}
          </h2>
          <p className="mt-3 text-ink-soft">
            Lens, Pulse, Atlas, Oracle, and Forge are modules inside one engineering
            control plane — not five unrelated products.
          </p>
        </div>
        <CapabilityGrid capabilities={platformCapabilities} />
      </Section>

      {/* 10-minute v1 workflow */}
      <Section className="border-t border-line bg-surface/50">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted">
              Complete in under 10 minutes
            </p>
            <h2 className="mt-3 font-display text-2xl font-medium text-ink md:text-3xl">
              One experience, end to end
            </h2>
            <p className="mt-3 text-ink-soft">
              Define a workload, benchmark real traffic, see a unified report, get
              recommendations, and export for your team. Calculators are optional step
              zero for quick ballpark checks.
            </p>
            <div className="mt-8">
              <Button href="/workflow">Open guided workflow</Button>
            </div>
          </div>
          <div className="rounded-lg border border-line bg-surface p-6 md:p-8">
            <V1ExperienceFlow />
          </div>
        </div>
      </Section>

      {/* Fragmented vs XARIV */}
      <Section>
        <div className="mb-10 max-w-2xl">
          <h2 className="font-display text-2xl font-medium text-ink md:text-3xl">
            Replace the fragmented stack
          </h2>
          <p className="mt-3 text-ink-soft">
            Today, every step of the AI infrastructure lifecycle uses a different tool.
            XARIV owns the decision workflow between them.
          </p>
        </div>
        <FragmentedComparison />
      </Section>

      {/* Enterprise lifecycle */}
      <Section className="border-t border-line bg-surface/50">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          Enterprise lifecycle
        </p>
        <h2 className="mt-3 font-display text-2xl font-medium text-ink">
          Every phase of AI infrastructure, one platform
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {enterpriseLifecycle.map((phase) => (
            <Card key={phase.phase} href={phase.href} className="flex flex-col">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium uppercase tracking-wider text-muted">
                  {phase.phase}
                </p>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase ${
                    phase.status === "live"
                      ? "bg-accent/10 text-accent"
                      : "border border-dashed border-line text-muted"
                  }`}
                >
                  {phase.status}
                </span>
              </div>
              <p className="mt-3 flex-1 text-sm text-ink-soft">{phase.question}</p>
              <p className="mt-4 text-xs font-medium text-accent">{phase.module}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Cross-functional personas */}
      <Section>
        <h2 className="font-display text-2xl font-medium text-ink md:text-3xl">
          Built for cross-functional teams
        </h2>
        <p className="mt-3 max-w-xl text-ink-soft">
          Product, ML, platform, SRE, finance, and leadership — one platform, multiple
          personas, same source of truth.
        </p>
        <div className="mt-10">
          <PersonaPipeline />
        </div>
      </Section>

      {/* Case study */}
      <Section className="border-t border-line bg-surface/50">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          Platform in action
        </p>
        <h2 className="mt-3 font-display text-2xl font-medium text-ink">
          48 GPUs → 31 GPUs
        </h2>
        <p className="mt-3 max-w-2xl text-ink-soft">
          <span className="font-medium text-ink">{caseStudy.customer}.</span>{" "}
          {caseStudy.problem} {caseStudy.solution} {caseStudy.result}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/workflow">Walk through this example</Button>
          <Button href="/lens" variant="secondary">
            Try Lens
          </Button>
        </div>
      </Section>

      {/* Social proof */}
      <Section>
        <div className="grid gap-4 sm:grid-cols-3">
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

      {/* Architecture Studies */}
      <Section className="border-t border-line">
        <div className="mb-10">
          <h2 className="font-display text-2xl font-medium text-ink md:text-3xl">
            Architecture Studies
          </h2>
          <p className="mt-3 max-w-lg text-ink-soft">
            First-principles engineering analysis behind the platform models.
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
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-medium text-ink">
            {site.tagline}
          </h2>
          <p className="mt-4 text-ink-soft">
            Start with a workload definition. Complete the workflow in under 10 minutes.
            Export when your team is ready to decide.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/lens">Define a workload</Button>
            <Button href="/workflow" variant="secondary">
              Guided workflow
            </Button>
            <Button href="/contact?intent=demo" variant="secondary">
              Book demo
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
