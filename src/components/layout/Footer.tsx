import Link from "next/link";
import { site, footerNav } from "@/lib/constants";
import { Logo } from "@/components/brand/Logo";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="mt-auto bg-footer-bg text-footer-ink">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo variant="light" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-footer-muted">
              {site.description}
            </p>
          </div>
          <div>
            <p className="eyebrow text-footer-muted">Product</p>
            <ul className="mt-4 space-y-2.5">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    prefetch
                    className="text-sm text-footer-muted transition-colors hover:text-footer-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-footer-muted">Connect</p>
            <ul className="mt-4 space-y-2.5 text-sm text-footer-muted">
              <li>
                <a
                  href={site.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-footer-ink"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-footer-ink"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="hover:text-footer-ink">
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-12 border-t border-white/10 pt-8 text-sm text-footer-muted">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
