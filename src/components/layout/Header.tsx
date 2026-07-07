"use client";

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/lib/constants";
import { Logo } from "@/components/brand/Logo";
import { MobileNav } from "./MobileNav";
import { Container } from "./Container";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-canvas/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="shrink-0 transition-opacity hover:opacity-80">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "font-medium text-ink"
                    : "text-ink-soft hover:bg-canvas-subtle hover:text-ink"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {item.label}
                  {item.live && (
                    <span className="rounded-full bg-accent-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                      Live
                    </span>
                  )}
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/docs"
            prefetch
            className="hidden text-sm text-ink-soft transition-colors hover:text-ink md:inline-block"
          >
            Docs
          </Link>
          <Link
            href="/lens"
            prefetch
            className="hidden rounded-lg bg-cta-gradient px-4 py-2 text-sm font-medium text-white shadow-sm shadow-accent/20 transition-opacity hover:opacity-90 sm:inline-block"
          >
            Try Lens
          </Link>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
