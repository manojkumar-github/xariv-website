import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { CapabilityGrid } from "@/components/platform/CapabilityGrid";
import { platformPositioning, platformCapabilities } from "@/data/platform";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Platform",
  description:
    "XARIV platform modules — Lens, Pulse, Atlas, Oracle, and Forge as capabilities inside one engineering control plane.",
};

export default function ProductsPage() {
  const live = products.filter((p) => p.status === "preview" || p.appPath);
  const planned = products.filter((p) => p.status === "planned");

  return (
    <Section className="pt-16">
      <p className="text-sm font-medium uppercase tracking-widest text-muted">
        {platformPositioning.category}
      </p>
      <h1 className="mt-4 font-display text-3xl font-medium text-ink md:text-4xl">
        Platform modules
      </h1>
      <p className="mt-4 max-w-2xl text-ink-soft">
        Lens, Pulse, Atlas, Oracle, and Forge are capabilities inside one platform — not
        separate tools you stitch together. Each module serves a phase of the infrastructure
        decision workflow.
      </p>
      <div className="mt-8">
        <Button href="/workflow">See the workflow</Button>
      </div>

      <div className="mt-16">
        <h2 className="font-display text-xl font-medium text-ink">Capabilities</h2>
        <div className="mt-6">
          <CapabilityGrid capabilities={platformCapabilities} />
        </div>
      </div>

      <div className="mt-16">
        <h2 className="font-display text-xl font-medium text-ink">Live modules</h2>
        <div className="mt-6 grid gap-6">
          {live.map((product) => (
            <Card key={product.slug} href={product.appPath ?? `/products/${product.slug}`} className="p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted">
                    {product.tagline}
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-medium text-ink">
                    {product.name}
                  </h2>
                </div>
                <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                  Live
                </span>
              </div>
              <p className="mt-4 max-w-2xl text-ink-soft">{product.description}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {product.capabilities.map((cap) => (
                  <li
                    key={cap}
                    className="rounded-md bg-canvas px-3 py-1 text-xs text-ink-soft"
                  >
                    {cap}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>

      {planned.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-xl font-medium text-ink">Roadmap modules</h2>
          <p className="mt-2 text-sm text-muted">
            Natural extensions of the same workflow — not separate product lines.
          </p>
          <div className="mt-6 grid gap-4">
            {planned.map((product) => (
              <div
                key={product.slug}
                className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-dashed border-line bg-canvas/50 px-6 py-5"
              >
                <div>
                  <p className="font-medium text-ink">{product.name}</p>
                  <p className="text-sm text-muted">{product.tagline}</p>
                  <p className="mt-2 max-w-xl text-xs text-muted">{product.description}</p>
                </div>
                <Link
                  href={`/contact?intent=waitlist&product=${product.slug}`}
                  className="shrink-0 text-sm font-medium text-accent hover:underline"
                >
                  Join waitlist →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}
