"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { nav } from "@/lib/constants";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="rounded-lg border border-line px-3 py-1.5 text-sm text-ink-soft"
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        Menu
      </button>
      {open && (
        <nav className="absolute left-0 right-0 top-16 border-b border-line bg-canvas px-6 py-4 shadow-lg">
          <ul className="space-y-1">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    prefetch
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                      active ? "font-medium text-ink" : "text-ink-soft hover:bg-canvas-subtle"
                    }`}
                  >
                    {item.label}
                    {item.live && (
                      <span className="rounded-full bg-accent-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase text-accent">
                        Live
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
            <li className="pt-2">
              <Link
                href="/lens"
                prefetch
                onClick={() => setOpen(false)}
                className="block rounded-lg bg-cta-gradient px-4 py-2.5 text-center text-sm font-medium text-white"
              >
                Try Lens
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
