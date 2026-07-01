import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { MarkdownContent } from "@/components/content/MarkdownContent";
import { blogPosts, getBlogPost } from "@/data/blog";
import { getMarkdownContent } from "@/lib/content";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Blog" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const md = getMarkdownContent("blog", slug);

  return (
    <Section narrow className="pt-16">
      <Link href="/blog" className="text-sm text-muted transition-colors hover:text-ink">
        ← Blog
      </Link>

      <p className="mt-8 text-xs font-medium uppercase tracking-wider text-accent">
        {post.category}
      </p>
      <h1 className="mt-3 font-display text-3xl font-medium leading-tight text-ink md:text-4xl">
        {post.title}
      </h1>
      <div className="mt-6 flex items-center gap-3 text-sm text-muted">
        <time dateTime={post.date}>
          {new Date(post.date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </time>
        <span>·</span>
        <span>{post.readingTime}</span>
      </div>

      <div className="mt-12">
        {md ? (
          <MarkdownContent content={md.content} />
        ) : (
          <div className="prose">
            <p className="text-lg text-ink-soft">{post.excerpt}</p>
            <p className="mt-6 text-muted">Full article coming soon.</p>
          </div>
        )}
      </div>
    </Section>
  );
}
