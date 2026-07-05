import Link from "next/link";
import { ReactNode } from "react";
import { Section } from "@/components/ui/Section";
import { getProduct } from "@/data/products";

interface ProductToolShellProps {
  productSlug: "lens" | "pulse";
  headline: string;
  description: string;
  stages?: string[];
  children: ReactNode;
}

export function ProductToolShell({
  productSlug,
  headline,
  description,
  stages,
  children,
}: ProductToolShellProps) {
  const product = getProduct(productSlug);
  const name = product?.name ?? `XARIV ${productSlug}`;
  const tagline = product?.tagline ?? "Product";

  return (
    <Section className="pt-12 pb-20 md:pt-16 md:pb-28">
      <Link href="/products" className="text-sm text-muted transition-colors hover:text-ink">
        ← Products
      </Link>

      <p className="mt-8 text-xs font-medium uppercase tracking-wider text-muted">{tagline}</p>
      <h1 className="mt-3 font-display text-3xl font-medium text-ink md:text-4xl">{name}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">{headline}</p>
      <p className="mt-3 max-w-2xl text-sm text-muted">{description}</p>

      {stages && stages.length > 0 && (
        <nav className="mt-6 flex flex-wrap gap-2" aria-label="Workflow stages">
          {stages.map((stage, i) => (
            <span key={stage} className="flex items-center gap-2 text-xs text-muted">
              <span className="rounded-md border border-line bg-white px-2.5 py-1 text-ink-soft">
                {stage}
              </span>
              {i < stages.length - 1 && <span aria-hidden>→</span>}
            </span>
          ))}
        </nav>
      )}

      <div className="mt-10 flex flex-wrap gap-4 text-sm">
        <Link href={`/products/${productSlug}`} className="text-accent hover:underline">
          Product overview →
        </Link>
        <Link href="/tools" className="text-accent hover:underline">
          Infrastructure calculators →
        </Link>
      </div>

      <div className="mt-10">{children}</div>
    </Section>
  );
}
