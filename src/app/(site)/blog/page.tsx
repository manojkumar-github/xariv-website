import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { blogCategories } from "@/lib/constants";
import { blogPosts } from "@/data/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Technical writing on AI infrastructure engineering.",
};

export default function BlogPage() {
  return (
    <Section className="pt-16">
      <h1 className="font-display text-3xl font-medium text-ink md:text-4xl">Blog</h1>
      <p className="mt-4 max-w-xl text-ink-soft">
        Shorter technical notes on inference serving, GPU optimization, and
        platform engineering.
      </p>

      <div className="mt-10 flex flex-wrap gap-2">
        {blogCategories.map((cat) => (
          <span
            key={cat}
            className="rounded-full border border-line px-3 py-1 text-xs text-muted"
          >
            {cat}
          </span>
        ))}
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {blogPosts.map((post) => (
          <ArticleCard
            key={post.slug}
            href={`/blog/${post.slug}`}
            title={post.title}
            excerpt={post.excerpt}
            date={post.date}
            category={post.category}
            readingTime={post.readingTime}
          />
        ))}
      </div>
    </Section>
  );
}
