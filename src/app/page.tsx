import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { products } from "@/data/products";
import { architectureStudies } from "@/data/architecture-studies";

export default function HomePage() {
  const featuredStudies = architectureStudies.slice(0, 3);

  return (
    <>
      <Section className="animate-fade-in pt-24 md:pt-32">
        <p className="text-sm font-medium uppercase tracking-widest text-muted">
          AI Infrastructure Intelligence
        </p>
        <h1 className="mt-6 max-w-3xl font-display text-4xl font-medium leading-[1.1] tracking-tight text-ink md:text-5xl lg:text-[3.25rem]">
          Infrastructure Intelligence for the Age of AI
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
          XARIV builds software for understanding, optimizing, and planning AI
          infrastructure — before you provision a single GPU.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button href="/products">Explore Products</Button>
          <Button href="/architecture-studies" variant="secondary">
            Read Architecture Studies
          </Button>
        </div>
      </Section>

      <Section className="border-t border-line bg-white/50">
        <div className="mb-12">
          <h2 className="font-display text-2xl font-medium text-ink md:text-3xl">
            Products
          </h2>
          <p className="mt-3 max-w-lg text-ink-soft">
            First-principles models over real hardware catalogs. Predict cost,
            performance, and bottlenecks — then benchmark and plan capacity.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {products.map((product) => (
            <Card
              key={product.slug}
              href={product.appPath ?? `/products/${product.slug}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted">
                    {product.tagline}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-medium text-ink">
                    {product.name}
                  </h3>
                </div>
                <span className="shrink-0 rounded-full border border-line px-2.5 py-0.5 text-xs text-muted capitalize">
                  {product.status}
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {product.description}
              </p>
            </Card>
          ))}
        </div>
        <Link
          href="/products"
          className="mt-8 inline-block text-sm font-medium text-accent hover:underline"
        >
          View all products →
        </Link>
      </Section>

      <Section>
        <div className="mb-12">
          <h2 className="font-display text-2xl font-medium text-ink md:text-3xl">
            Architecture Studies
          </h2>
          <p className="mt-3 max-w-lg text-ink-soft">
            Long-form engineering analysis — reasoning from first principles about
            the systems that run large-scale AI.
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

      <Section className="border-t border-line">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl font-medium text-ink">
            Engineering-first
          </h2>
          <p className="mt-4 text-ink-soft leading-relaxed">
            We build for the teams that size clusters, debug tail latency, and
            justify nine-figure GPU budgets. No hype — roofline models, capacity
            math, and the reasoning behind every number.
          </p>
        </div>
      </Section>
    </>
  );
}
