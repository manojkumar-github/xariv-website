export const platformPositioning = {
  category: "Engineering Control Plane for AI Infrastructure",
  headline: "Make better AI infrastructure decisions",
  subhead:
    "XARIV helps engineering teams reduce the time, cost, and uncertainty of building AI systems — from first workload sketch to procurement-ready architecture review.",
  oneLiner:
    "The platform where planning, benchmarking, explainability, optimization, and forecasting converge.",
} as const;

export const customerProblems = [
  {
    quote: "My AI feature is slow, expensive, and I don't know why.",
    detail: "Latency spikes, GPU bills, and no clear bottleneck.",
  },
  {
    quote: "Leadership wants 10M users next quarter. Can we?",
    detail: "Capacity questions with no model beyond spreadsheets.",
  },
  {
    quote: "We have twelve tools and no single source of truth.",
    detail: "Hugging Face, vLLM, Datadog, Excel — nothing connects the decision.",
  },
] as const;

export interface PlatformCapability {
  id: string;
  name: string;
  description: string;
  modules: { name: string; status: "live" | "planned"; href: string }[];
}

export const platformCapabilities: PlatformCapability[] = [
  {
    id: "planning",
    name: "Planning",
    description: "Which model, how many GPUs, what will it cost?",
    modules: [
      { name: "Lens", status: "live", href: "/lens" },
      { name: "Oracle", status: "planned", href: "/products/oracle" },
    ],
  },
  {
    id: "benchmarking",
    name: "Benchmarking",
    description: "Run experiments. Collect TTFT, throughput, and GPU telemetry.",
    modules: [{ name: "Pulse", status: "live", href: "/pulse" }],
  },
  {
    id: "explainability",
    name: "Explainability",
    description: "Performance dropped — why? KV cache, NCCL, memory, compute.",
    modules: [
      { name: "Lens", status: "live", href: "/lens" },
      { name: "Atlas", status: "planned", href: "/products/atlas" },
    ],
  },
  {
    id: "optimization",
    name: "Optimization",
    description: "FP8, tensor parallelism, batching, KV pool — ranked by impact.",
    modules: [{ name: "Lens", status: "live", href: "/lens" }],
  },
  {
    id: "forecasting",
    name: "Forecasting",
    description: "Traffic doubles. What happens to latency, cost, and headroom?",
    modules: [{ name: "Forge", status: "planned", href: "/products/forge" }],
  },
];

export const enterpriseLifecycle = [
  {
    phase: "Planning",
    question: "Which model? How many GPUs? What will it cost?",
    module: "Lens · Oracle",
    href: "/lens",
    status: "live" as const,
  },
  {
    phase: "Benchmarking",
    question: "Does this stack hit SLO on real traffic?",
    module: "Pulse",
    href: "/pulse",
    status: "live" as const,
  },
  {
    phase: "Explainability",
    question: "Why did performance drop?",
    module: "Atlas",
    href: "/products/atlas",
    status: "planned" as const,
  },
  {
    phase: "Optimization",
    question: "What should we change first?",
    module: "Lens",
    href: "/lens",
    status: "live" as const,
  },
  {
    phase: "Capacity planning",
    question: "What happens when traffic doubles?",
    module: "Forge",
    href: "/products/forge",
    status: "planned" as const,
  },
];

export const crossFunctionalFlow = [
  {
    persona: "Product Manager",
    ask: "We expect 50M users next quarter.",
    action: "Set workload targets",
    href: "/workflow",
  },
  {
    persona: "ML Engineer",
    ask: "Which model fits our latency and cost envelope?",
    action: "Compare models",
    href: "/lens",
  },
  {
    persona: "Platform Engineer",
    ask: "How many GPUs do we actually need?",
    action: "Plan infrastructure",
    href: "/lens",
  },
  {
    persona: "SRE",
    ask: "Will we hit our p99 SLO in production?",
    action: "Benchmark & validate",
    href: "/pulse",
  },
  {
    persona: "Finance",
    ask: "What's the monthly GPU bill — and the carbon cost?",
    action: "Review economics",
    href: "/tools/eco-impact",
  },
  {
    persona: "Director",
    ask: "Approve deployment.",
    action: "Architecture decision report",
    href: "/contact?intent=report",
  },
];

export const fragmentedStack = [
  { step: "Model selection", tool: "Hugging Face, provider docs" },
  { step: "Deployment", tool: "Kubernetes, vLLM, Triton" },
  { step: "Benchmarking", tool: "GenAI-Perf, perf analyzers" },
  { step: "Monitoring", tool: "Datadog, Prometheus" },
  { step: "GPU metrics", tool: "DCGM, cloud dashboards" },
  { step: "Cost & capacity", tool: "Spreadsheets" },
];

export const v1Experience = [
  {
    step: 1,
    title: "Define your AI workload",
    description: "Model, hardware, traffic shape, and SLO targets.",
    href: "/lens",
    duration: "2 min",
  },
  {
    step: 2,
    title: "Run or import benchmark results",
    description: "Replay real datasets or paste your own prompts.",
    href: "/pulse",
    duration: "3 min",
  },
  {
    step: 3,
    title: "See a unified performance report",
    description: "Sizing, latency percentiles, utilization, and eco impact in one view.",
    href: "/workflow#report",
    duration: "1 min",
  },
  {
    step: 4,
    title: "Get explanations and recommendations",
    description: "Bottleneck classification with ranked optimization actions.",
    href: "/lens",
    duration: "2 min",
  },
  {
    step: 5,
    title: "Export for your team",
    description: "Share a decision report with engineering, FinOps, and leadership.",
    href: "/contact?intent=report",
    duration: "2 min",
  },
];
