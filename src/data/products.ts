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
    slug: "lens",
    name: "XARIV Lens",
    tagline: "AI Infrastructure Intelligence",
    description:
      "Predict infrastructure cost, performance, bottlenecks, and capacity before deployment. Roofline-based models over real GPU, model, and fabric catalogs — with explainable recommendations.",
    status: "preview",
    appPath: "/lens",
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
    slug: "relay",
    name: "XARIV Relay",
    tagline: "Self-hosted open-weight serving",
    description:
      "Download open-weight models, serve them on your own Mac with llama.cpp (or vLLM on Linux NVIDIA), and compare two local endpoints side by side — TTFT, stream speed, and output.",
    status: "preview",
    appPath: "/relay",
    capabilities: [
      "Hugging Face GGUF download or local import",
      "Deploy to localhost (llama.cpp Metal on Mac)",
      "OpenAI-compatible /v1 endpoints",
      "Split-pane live compare of two candidates",
    ],
  },
  {
    slug: "hearth",
    name: "XARIV Hearth",
    tagline: "Your private ChatGPT — on your Mac",
    description:
      "Host a ChatGPT-like app entirely on your machine. Small 1–3B open models via llama.cpp, multi-turn chat, zero cloud. Fine-tune and publish your own models through Relay later.",
    status: "preview",
    appPath: "/hearth",
    capabilities: [
      "Local chat UI over Relay deployments",
      "1–3B GGUF models (Llama 3.2 family)",
      "Streaming responses — data stays on Mac",
      "Future: fine-tune, host, and publish custom models",
    ],
  },
  {
    slug: "atlas",
    name: "XARIV Atlas",
    tagline: "Infrastructure Knowledge Graph",
    description:
      "Continuously calibrated infrastructure intelligence from telemetry, benchmarks, and production deployments. Coming soon.",
    status: "planned",
    capabilities: [
      "Telemetry-driven model calibration",
      "Cross-deployment learning",
      "Hardware efficiency factors",
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
