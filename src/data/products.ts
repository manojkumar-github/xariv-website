export interface Product {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  status: "available" | "preview" | "planned";
  capabilities: string[];
  appPath?: string;
}

export const products: Product[] = [
  {
    slug: "atlas",
    name: "XARIV Atlas",
    tagline: "AI Infrastructure Intelligence",
    description:
      "Predict infrastructure cost, performance, bottlenecks, and capacity before deployment. Roofline-based models over real GPU, model, and fabric catalogs — with explainable recommendations.",
    status: "preview",
    appPath: "/atlas",
    capabilities: [
      "GPU sizing and replica count",
      "Cost and power estimation",
      "Bottleneck classification",
      "Latency SLO analysis",
    ],
  },
  {
    slug: "pulse",
    name: "XARIV Pulse",
    tagline: "Inference Benchmarking & Telemetry",
    description:
      "Benchmark LLM inference workloads and visualize TTFT, ITL, TPOT, end-to-end latency, throughput, and GPU telemetry across public or custom datasets.",
    status: "preview",
    appPath: "/pulse",
    capabilities: [
      "Dataset replay (ShareGPT, LMSYS, custom)",
      "Latency percentile distributions",
      "GPU utilization and power modeling",
      "Throughput under concurrency",
    ],
  },
  {
    slug: "oracle",
    name: "XARIV Oracle",
    tagline: "Capacity Planning",
    description:
      "Estimate GPU fleet size, utilization curves, and infrastructure cost as traffic, models, and hardware change — grounded in workload profiles, not spreadsheets.",
    status: "planned",
    capabilities: [
      "Fleet sizing under growth scenarios",
      "Reserved vs on-demand economics",
      "Utilization and headroom forecasting",
      "Multi-region capacity models",
    ],
  },
  {
    slug: "forge",
    name: "XARIV Forge",
    tagline: "Infrastructure Simulation",
    description:
      "A digital twin for AI infrastructure. Mirror a cluster and simulate new models, traffic growth, MoE routing, and agent workloads to predict bottlenecks before they happen.",
    status: "planned",
    capabilities: [
      "Cluster topology modeling",
      "Traffic and model migration simulation",
      "What-if analysis for hardware changes",
      "Continuous calibration from telemetry",
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
