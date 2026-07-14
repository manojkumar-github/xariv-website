import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { AuthControls } from "@/components/auth/AuthProviders";

const links = [
  { href: "/app", label: "Experiments" },
  { href: "/app/experiments/new", label: "New run" },
  { href: "/app/connect", label: "Connect agent" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full bg-canvas-subtle">
      <header className="border-b border-line bg-canvas">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="shrink-0">
              <Logo size={24} />
            </Link>
            <nav className="flex items-center gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-md px-3 py-1.5 text-sm text-ink-soft hover:bg-canvas-subtle hover:text-ink"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
          <AuthControls />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
