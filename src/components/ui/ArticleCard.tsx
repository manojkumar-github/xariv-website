import Link from "next/link";
import { Card } from "./Card";

interface ArticleCardProps {
  href: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readingTime: string;
}

export function ArticleCard({
  href,
  title,
  excerpt,
  date,
  category,
  readingTime,
}: ArticleCardProps) {
  return (
    <Card href={href}>
      <span className="text-xs font-medium uppercase tracking-wider text-accent">
        {category}
      </span>
      <h3 className="mt-3 font-display text-xl font-medium leading-snug text-ink transition-colors group-hover:text-accent">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-muted">{excerpt}</p>
      <div className="mt-5 flex items-center gap-3 text-xs text-muted">
        <time dateTime={date}>
          {new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </time>
        <span>·</span>
        <span>{readingTime}</span>
      </div>
    </Card>
  );
}
