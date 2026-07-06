export const site = {
  name: "XARIV",
  tagline: "Engineering Control Plane for AI Infrastructure",
  description:
    "XARIV helps engineering teams make better AI infrastructure decisions — planning, benchmarking, explainability, optimization, and forecasting in one platform.",
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
