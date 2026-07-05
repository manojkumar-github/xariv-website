import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { HeroDiagram } from "@/components/brand/HeroDiagram";
import { XarivMark } from "@/components/brand/Logo";
import { products } from "@/data/products";
import { architectureStudies } from "@/data/architecture-studies";
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
  const liveProducts = products.filter((p) => p.appPath);
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
              Infrastructure Intelligence for the Age of AI
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft">
              {site.description} Built for researchers, data scientists, ML engineers,
              startups, and enterprise teams planning GPU infrastructure.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/lens">Try Lens — free</Button>
              <Button href="/pulse" variant="secondary">
                Run Pulse
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

      {/* Outcomes + logos */}
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

      {/* Who it's for */}
      <Section>
        <h2 className="font-display text-2xl font-medium text-ink md:text-3xl">
          Built for every stage of AI infrastructure
        </h2>
        <p className="mt-3 max-w-xl text-ink-soft">
          Whether you are prototyping in a lab or operating a multi-region GPU fleet, XARIV
          answers the same question first: will this workload actually work on this hardware?
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

      {/* Case study */}
      <Section className="border-t border-line bg-surface/50">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          Customer story
        </p>
        <h2 className="mt-3 font-display text-2xl font-medium text-ink">
          Problem → Solution → Result
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-line bg-surface p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted">Problem</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              <span className="font-medium text-ink">{caseStudy.customer}.</span>{" "}
              {caseStudy.problem}
            </p>
          </div>
          <div className="rounded-lg border border-line bg-surface p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted">Solution</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{caseStudy.solution}</p>
          </div>
          <div className="rounded-lg border border-line border-accent/30 bg-surface p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-accent">Result</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{caseStudy.result}</p>
          </div>
        </div>
        <div className="mt-8">
          <Button href="/lens">Reproduce this analysis in Lens</Button>
        </div>
      </Section>

      {/* Products */}
      <Section>
        <div className="mb-10">
          <h2 className="font-display text-2xl font-medium text-ink md:text-3xl">Products</h2>
          <p className="mt-3 max-w-lg text-ink-soft">
            Live tools for prediction and profiling. Roadmap products for knowledge graphs,
            capacity planning, and simulation.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {liveProducts.map((product) => (
            <Card key={product.slug} href={product.appPath!}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted">
                    {product.tagline}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-medium text-ink">
                    {product.name}
                  </h3>
                </div>
                <span className="shrink-0 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                  Live
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted">{product.description}</p>
            </Card>
          ))}
        </div>
        {plannedProducts.length > 0 && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
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
                  Join waitlist
                </Link>
              </div>
            ))}
          </div>
        )}
        <Link
          href="/products"
          className="mt-8 inline-block text-sm font-medium text-accent hover:underline"
        >
          View all products →
        </Link>
      </Section>

      {/* Architecture Studies */}
      <Section className="border-t border-line">
        <div className="mb-10">
          <h2 className="font-display text-2xl font-medium text-ink md:text-3xl">
            Architecture Studies
          </h2>
          <p className="mt-3 max-w-lg text-ink-soft">
            Long-form engineering analysis — reasoning from first principles about the
            systems that run large-scale AI.
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
            Start with a free prediction
          </h2>
          <p className="mt-4 text-ink-soft leading-relaxed">
            No account required. Describe your workload in Lens, profile real traffic in
            Pulse, or run quick estimates in our infrastructure calculators.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/lens">Try Lens</Button>
            <Button href="/contact?intent=demo" variant="secondary">
              Book demo
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
