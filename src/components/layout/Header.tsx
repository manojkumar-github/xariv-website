"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site, nav } from "@/lib/constants";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { MobileNav } from "./MobileNav";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/90 backdrop-blur-sm">
      <div className="relative mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-6">
        <Link href="/" className="shrink-0 transition-opacity hover:opacity-80">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-5 lg:flex">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                className={`flex items-center gap-1.5 text-sm transition-colors ${
                  active ? "font-medium text-ink" : "text-ink-soft hover:text-ink"
                }`}
              >
                {item.label}
                {item.live && (
                  <span className="rounded-full bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent">
                    Live
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Link
            href="/lens"
            prefetch
            className="hidden rounded-md bg-ink px-4 py-2 text-sm font-medium text-canvas transition-opacity hover:opacity-85 sm:inline-block"
          >
            Try Lens
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
