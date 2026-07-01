"use client";

import Link from "next/link";
import { useState } from "react";
import { nav } from "@/lib/constants";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="rounded-md border border-line px-3 py-1.5 text-sm text-ink-soft"
        aria-label="Toggle menu"
      >
        Menu
      </button>
      {open && (
        <nav className="absolute left-0 right-0 top-16 border-b border-line bg-canvas px-6 py-4 shadow-sm">
          <ul className="space-y-3">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block text-sm text-ink-soft hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
