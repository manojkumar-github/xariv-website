import Link from "next/link";
import { ReactNode } from "react";

interface CardProps {
  href?: string;
  children: ReactNode;
  className?: string;
}

export function Card({ href, children, className = "" }: CardProps) {
  const styles = `group rounded-lg border border-line bg-white p-6 transition-all duration-200 hover:border-ink-soft/30 hover:shadow-sm ${className}`;

  if (href) {
    return (
      <Link href={href} className={`block ${styles}`}>
        {children}
      </Link>
    );
  }

  return <div className={styles}>{children}</div>;
}
