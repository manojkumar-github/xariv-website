import Link from "next/link";
import { site, footerNav } from "@/lib/constants";
import { Logo } from "@/components/brand/Logo";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-canvas">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <Logo />
            <p className="mt-3 text-sm text-muted">{site.description}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted">Navigation</p>
            <ul className="mt-4 space-y-2">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    prefetch
                    className="text-sm text-ink-soft transition-colors hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted">Connect</p>
            <ul className="mt-4 space-y-2 text-sm text-ink-soft">
              <li>
                <a
                  href={site.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="hover:text-ink">
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-12 border-t border-line pt-8 text-sm text-muted">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
