export type NavItem = {
  label: string;
  href: string;
  live?: boolean;
};

export const nav: NavItem[] = [
  { label: "Workflow", href: "/workflow" },
  { label: "Products", href: "/products" },
  { label: "Lens", href: "/lens", live: true },
  { label: "Pulse", href: "/pulse", live: true },
  { label: "Tools", href: "/tools" },
  { label: "Docs", href: "/docs" },
  { label: "Studies", href: "/architecture-studies" },
  { label: "Contact", href: "/contact" },
];

export const footerNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Workflow", href: "/workflow" },
  { label: "Products", href: "/products" },
  { label: "Lens", href: "/lens" },
  { label: "Pulse", href: "/pulse" },
  { label: "Tools", href: "/tools" },
  { label: "Docs", href: "/docs" },
  { label: "Architecture Studies", href: "/architecture-studies" },
  { label: "Blog", href: "/blog" },
  { label: "Open Source", href: "/open-source" },
  { label: "Company", href: "/company" },
  { label: "Contact", href: "/contact" },
];
