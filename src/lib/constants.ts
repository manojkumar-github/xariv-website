export const site = {
  name: "XARIV",
  tagline: "Infrastructure Intelligence for the Age of AI",
  description:
    "Software for understanding, optimizing, and planning AI infrastructure — before you provision a single GPU.",
  url: "https://xariv-website.vercel.app",
  github: "https://github.com/manojkumar-github",
  linkedin: "https://www.linkedin.com/company/xariv",
  email: "hello@xariv.com",
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Architecture Studies", href: "/architecture-studies" },
  { label: "Blog", href: "/blog" },
  { label: "Open Source", href: "/open-source" },
  { label: "Company", href: "/company" },
  { label: "Contact", href: "/contact" },
] as const;

export const blogCategories = [
  "AI Infrastructure",
  "Distributed Inference",
  "GPU Optimization",
  "TensorRT",
  "vLLM",
  "MoE",
  "Networking",
  "Benchmarking",
  "Capacity Planning",
  "Agentic AI",
] as const;
