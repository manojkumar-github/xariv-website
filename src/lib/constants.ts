export const site = {
  name: "XARIV",
  tagline: "Infrastructure Intelligence for the Age of AI",
  description:
    "Software for understanding, optimizing, and planning AI infrastructure — before you provision a single GPU.",
  url: "https://xariv-website.vercel.app",
  github: "https://github.com/xariv-labs",
  linkedin: "https://www.linkedin.com/company/xariv",
  email: "hello@xariv.com",
} as const;

export { nav, footerNav } from "./nav";

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
