import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { getProduct, products } from "@/data/products";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  return (
    <Section narrow className="pt-16">
      <Link
        href="/products"
        className="text-sm text-muted transition-colors hover:text-ink"
      >
        ← Products
      </Link>

      <p className="mt-8 text-xs font-medium uppercase tracking-wider text-muted">
        {product.tagline}
      </p>
      <h1 className="mt-3 font-display text-3xl font-medium text-ink md:text-4xl">
        {product.name}
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-soft">
        {product.description}
      </p>

      <div className="mt-10 rounded-lg border border-line bg-white p-8">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          Capabilities
        </p>
        <ul className="mt-4 space-y-3">
          {product.capabilities.map((cap) => (
            <li key={cap} className="flex gap-3 text-sm text-ink-soft">
              <span className="text-accent">—</span>
              {cap}
            </li>
          ))}
        </ul>
      </div>

      {product.appPath && (
        <div className="mt-10">
          <Button href={product.appPath}>Launch {product.name.replace("XARIV ", "")}</Button>
        </div>
      )}

      {!product.appPath && (
        <div className="mt-10 rounded-lg border border-dashed border-line bg-canvas/50 p-12 text-center">
          <p className="text-sm text-muted">
            Interactive preview coming soon.
          </p>
        </div>
      )}

      <p className="mt-8 text-sm text-muted">
        Status: <span className="capitalize text-ink-soft">{product.status}</span>
      </p>
    </Section>
  );
}
