import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with XARIV — book a demo, join a waitlist, or discuss partnerships.",
};

const channels = [
  {
    title: "Book a demo",
    description:
      "Walk through Lens and Pulse with your workload. For platform teams, infra leads, and enterprise evaluations.",
    action: `mailto:${site.email}?subject=Demo%20request`,
    label: "Schedule demo",
    highlight: true,
  },
  {
    title: "Atlas waitlist",
    description: "Infrastructure knowledge graph — telemetry-driven calibration. Coming soon.",
    action: `mailto:${site.email}?subject=Atlas%20waitlist`,
    label: "Join Atlas waitlist",
  },
  {
    title: "Oracle waitlist",
    description: "Capacity planning and fleet sizing under growth scenarios. Coming soon.",
    action: `mailto:${site.email}?subject=Oracle%20waitlist`,
    label: "Join Oracle waitlist",
  },
  {
    title: "Enterprise inquiries",
    description:
      "Infrastructure intelligence for teams sizing GPU fleets or evaluating inference stacks.",
    action: `mailto:${site.email}?subject=Enterprise%20inquiry`,
    label: site.email,
  },
  {
    title: "Speaking",
    description: "Conference talks and engineering workshops on AI infrastructure.",
    action: `mailto:${site.email}?subject=Speaking%20inquiry`,
    label: "Request a talk",
  },
  {
    title: "Partnerships",
    description: "Cloud providers, hardware vendors, and platform integrations.",
    action: `mailto:${site.email}?subject=Partnership%20inquiry`,
    label: "Discuss partnership",
  },
];

export default function ContactPage() {
  return (
    <Section narrow className="pt-16">
      <h1 className="font-display text-3xl font-medium text-ink md:text-4xl">Contact</h1>
      <p className="mt-4 text-ink-soft">
        Book a demo, join a product waitlist, or reach out for enterprise evaluations.
      </p>

      <div className="mt-12 flex flex-wrap gap-3">
        <Button href="/lens">Try Lens first</Button>
        <Button href={`mailto:${site.email}?subject=Demo%20request`} variant="secondary">
          Book demo
        </Button>
      </div>

      <div className="mt-16 space-y-8">
        {channels.map((ch) => (
          <div
            key={ch.title}
            className={
              ch.highlight
                ? "rounded-lg border border-line bg-white p-6"
                : "border-b border-line pb-8 last:border-0"
            }
          >
            <h2 className="font-display text-lg font-medium text-ink">{ch.title}</h2>
            <p className="mt-2 text-sm text-ink-soft">{ch.description}</p>
            <a
              href={ch.action}
              className="mt-4 inline-block text-sm font-medium text-accent hover:underline"
            >
              {ch.label} →
            </a>
          </div>
        ))}
      </div>

      <div className="mt-16 flex gap-6 text-sm">
        <a
          href={site.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink-soft hover:text-ink"
        >
          GitHub
        </a>
        <a
          href={site.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink-soft hover:text-ink"
        >
          LinkedIn
        </a>
      </div>
    </Section>
  );
}
