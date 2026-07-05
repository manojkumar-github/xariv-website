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
        className="rounded-md border border-line px-3 py-1.5 text-sm text-ink-soft"
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        Menu
      </button>
      {open && (
        <nav className="absolute left-0 right-0 top-16 border-b border-line bg-canvas px-6 py-4 shadow-sm">
          <ul className="space-y-3">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    prefetch
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2 text-sm ${
                      active ? "font-medium text-ink" : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    {item.label}
                    {item.live && (
                      <span className="rounded-full bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium uppercase text-accent">
                        Live
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
            <li>
              <Link
                href="/lens"
                prefetch
                onClick={() => setOpen(false)}
                className="block rounded-md bg-ink px-4 py-2 text-center text-sm font-medium text-canvas"
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
