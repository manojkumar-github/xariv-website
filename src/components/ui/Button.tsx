import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "inverse";
  external?: boolean;
  size?: "default" | "lg";
}

export function Button({
  href,
  children,
  variant = "primary",
  external,
  size = "default",
}: ButtonProps) {
  const sizeClass = size === "lg" ? "px-6 py-3 text-base" : "px-5 py-2.5 text-sm";
  const base = `inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ${sizeClass}`;

  const styles =
    variant === "primary"
      ? "bg-cta-gradient text-white shadow-sm shadow-accent/25 hover:opacity-90 hover:shadow-md hover:shadow-accent/30"
      : variant === "secondary"
        ? "border border-line bg-surface text-ink hover:border-accent/40 hover:bg-accent-muted/30"
        : variant === "inverse"
          ? "border border-white/30 bg-white/10 text-white hover:bg-white/20"
          : "text-ink-soft hover:text-ink";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={`${base} ${styles}`}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={`${base} ${styles}`}>
      {children}
    </Link>
  );
}
