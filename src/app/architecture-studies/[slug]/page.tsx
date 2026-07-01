import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { MarkdownContent } from "@/components/content/MarkdownContent";
import {
  architectureStudies,
  getStudy,
} from "@/data/architecture-studies";
import { getMarkdownContent } from "@/lib/content";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return architectureStudies.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = getStudy(slug);
  if (!study) return { title: "Architecture Study" };
  return { title: study.title, description: study.excerpt };
}

export default async function StudyPage({ params }: Props) {
  const { slug } = await params;
  const study = getStudy(slug);
  if (!study) notFound();

  const md = getMarkdownContent("architecture-studies", slug);

  return (
    <Section narrow className="pt-16">
      <Link
        href="/architecture-studies"
        className="text-sm text-muted transition-colors hover:text-ink"
      >
        ← Architecture Studies
      </Link>

      <p className="mt-8 text-xs font-medium uppercase tracking-wider text-accent">
        {study.category}
      </p>
      <h1 className="mt-3 font-display text-3xl font-medium leading-tight text-ink md:text-4xl">
        {study.title}
      </h1>
      <div className="mt-6 flex items-center gap-3 text-sm text-muted">
        <span>{study.author}</span>
        <span>·</span>
        <time dateTime={study.date}>
          {new Date(study.date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </time>
        <span>·</span>
        <span>{study.readingTime}</span>
      </div>

      <div className="mt-12">
        {md ? (
          <MarkdownContent content={md.content} />
        ) : (
          <div className="prose">
            <p className="text-lg text-ink-soft">{study.excerpt}</p>
            <p className="mt-6 text-muted">
              Full article content is being migrated. Check back soon.
            </p>
          </div>
        )}
      </div>
    </Section>
  );
}
