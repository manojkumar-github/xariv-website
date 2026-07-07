import Link from "next/link";
import { ReactNode } from "react";

interface CardProps {
  href?: string;
  children: ReactNode;
  className?: string;
}

export function Card({ href, children, className = "" }: CardProps) {
  const styles = `group rounded-xl border border-line bg-surface p-6 transition-all duration-200 hover:border-accent/30 hover:shadow-md hover:shadow-accent/5 ${className}`;

  if (href) {
    return (
      <Link href={href} className={`block ${styles}`}>
        {children}
      </Link>
    );
  }

  return <div className={styles}>{children}</div>;
}
