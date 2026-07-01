import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { site } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with XARIV.",
};

const channels = [
  {
    title: "Enterprise inquiries",
    description: "Infrastructure intelligence for teams sizing GPU fleets or evaluating inference stacks.",
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
  {
    title: "Newsletter",
    description: "Architecture studies and product updates. No spam.",
    action: `mailto:${site.email}?subject=Newsletter%20subscribe`,
    label: "Subscribe",
  },
];

export default function ContactPage() {
  return (
    <Section narrow className="pt-16">
      <h1 className="font-display text-3xl font-medium text-ink md:text-4xl">
        Contact
      </h1>
      <p className="mt-4 text-ink-soft">
        Reach out for enterprise evaluations, speaking, or partnerships.
      </p>

      <div className="mt-16 space-y-8">
        {channels.map((ch) => (
          <div key={ch.title} className="border-b border-line pb-8 last:border-0">
            <h2 className="font-display text-lg font-medium text-ink">
              {ch.title}
            </h2>
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
