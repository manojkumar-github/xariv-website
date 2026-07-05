import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Docs",
  description: "XARIV documentation — products, tools, APIs, and guides.",
};

const sections = [
  {
    title: "Getting started",
    links: [
      { label: "What is XARIV?", href: "/docs#getting-started" },
      { label: "Try Lens", href: "/lens" },
      { label: "Run Pulse", href: "/pulse" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "XARIV Lens", href: "/products/lens" },
      { label: "XARIV Pulse", href: "/products/pulse" },
      { label: "XARIV Atlas", href: "/products/atlas" },
    ],
  },
  {
    title: "Tools & calculators",
    links: [
      { label: "Infrastructure calculators", href: "/tools" },
      { label: "KV Cache calculator", href: "/tools/kv-cache" },
      { label: "Eco impact rating", href: "/tools/eco-impact" },
    ],
  },
  {
    title: "Reference",
    links: [
      { label: "Architecture studies", href: "/architecture-studies" },
      { label: "Open source", href: "/open-source" },
      { label: "GitHub", href: "https://github.com/xariv-labs", external: true },
    ],
  },
];

export default function DocsPage() {
  return (
    <Section className="pt-16">
      <p className="text-sm font-medium uppercase tracking-widest text-muted">Documentation</p>
      <h1 className="mt-4 font-display text-3xl font-medium text-ink md:text-4xl">Docs</h1>
      <p className="mt-4 max-w-2xl text-ink-soft">
        Guides and reference for XARIV products, infrastructure calculators, and deployment
        workflows.
      </p>

      <div id="getting-started" className="mt-12 rounded-lg border border-line bg-surface p-6">
        <h2 className="font-display text-xl font-medium text-ink">Getting started</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          XARIV helps you predict, profile, and plan AI infrastructure before provisioning GPUs.
          Start with{" "}
          <Link href="/lens" className="text-accent hover:underline">
            Lens
          </Link>{" "}
          to size a workload, then validate latency with{" "}
          <Link href="/pulse" className="text-accent hover:underline">
            Pulse
          </Link>
          . Use{" "}
          <Link href="/tools" className="text-accent hover:underline">
            calculators
          </Link>{" "}
          for quick estimates on KV cache, GPU memory, cost, and eco impact.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {sections.slice(1).map((section) => (
          <Card key={section.title}>
            <h2 className="font-display text-lg font-medium text-ink">{section.title}</h2>
            <ul className="mt-4 space-y-2">
              {section.links.map((link) => (
                <li key={link.label}>
                  {"external" in link && link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-accent hover:underline"
                    >
                      {link.label} →
                    </a>
                  ) : (
                    <Link href={link.href} className="text-sm text-accent hover:underline">
                      {link.label} →
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </Section>
  );
}
