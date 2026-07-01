import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { architectureStudies } from "@/data/architecture-studies";

export const metadata: Metadata = {
  title: "Architecture Studies",
  description:
    "Long-form engineering case studies on AI infrastructure at scale.",
};

export default function ArchitectureStudiesPage() {
  return (
    <Section className="pt-16">
      <h1 className="font-display text-3xl font-medium text-ink md:text-4xl">
        Architecture Studies
      </h1>
      <p className="mt-4 max-w-xl text-ink-soft">
        Hypothetical system studies that reason from first principles. Scale
        figures and design choices are illustrative — the aim is rigorous
        engineering analysis, not marketing.
      </p>

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {architectureStudies.map((study) => (
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
    </Section>
  );
}
