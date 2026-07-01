export interface OpenSourceProject {
  name: string;
  description: string;
  github: string;
  docs?: string;
  roadmap?: string;
  status: "active" | "preview";
}

export const openSourceProjects: OpenSourceProject[] = [
  {
    name: "xariv-platform",
    description:
      "First-principles prediction engine for LLM inference — roofline performance, capacity planning, network collectives, cost estimation, and bottleneck classification.",
    github: "https://github.com/manojkumar-github/xariv-platform",
    docs: "/products/atlas",
    roadmap: "V2 knowledge graph calibration from telemetry; V3 infrastructure digital twin.",
    status: "preview",
  },
  {
    name: "xariv-atlas",
    description:
      "Browser-side infrastructure intelligence UI. Describe a workload, get a decision report with sizing, economics, and binding constraints.",
    github: "https://github.com/manojkumar-github",
    status: "preview",
  },
  {
    name: "xariv-pulse",
    description:
      "Client-side inference profiler. Replay dataset token distributions on target hardware and summarize latency and telemetry metrics.",
    github: "https://github.com/manojkumar-github",
    status: "preview",
  },
];
