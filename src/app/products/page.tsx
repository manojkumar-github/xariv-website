import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Products",
  description: "XARIV product suite for AI infrastructure intelligence.",
};

export default function ProductsPage() {
  return (
    <Section className="pt-16">
      <h1 className="font-display text-3xl font-medium text-ink md:text-4xl">
        Products
      </h1>
      <p className="mt-4 max-w-xl text-ink-soft">
        Software for predicting, benchmarking, and simulating AI infrastructure.
        Each product addresses a distinct phase of the infrastructure lifecycle.
      </p>

      <div className="mt-16 grid gap-8">
        {products.map((product) => (
          <Card key={product.slug} href={`/products/${product.slug}`} className="p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted">
                  {product.tagline}
                </p>
                <h2 className="mt-2 font-display text-2xl font-medium text-ink">
                  {product.name}
                </h2>
              </div>
              <span className="rounded-full border border-line px-3 py-1 text-xs text-muted capitalize">
                {product.status}
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
            <Link
              href={`/products/${product.slug}`}
              className="mt-6 inline-block text-sm font-medium text-accent"
            >
              Learn more →
            </Link>
          </Card>
        ))}
      </div>
    </Section>
  );
}
