export interface WorkflowStep {
  step: number;
  id: string;
  phase: string;
  title: string;
  question: string;
  description: string;
  tool: string;
  href: string;
  duration: string;
  outputs: string[];
  nextHref?: string;
  nextLabel?: string;
}

export const workflowTagline =
  "One platform for every infrastructure decision — from first workload sketch to procurement approval.";

/** v1 guided path — calculators as quick entry, then platform workflow */
export const workflowSteps: WorkflowStep[] = [
  {
    step: 0,
    id: "estimate",
    phase: "Quick check",
    title: "Sanity-check the numbers",
    question: "Is this workload in the right ballpark?",
    description:
      "Optional first pass with free calculators — KV cache, GPU memory, cost, throughput, carbon. Under 30 seconds each before you commit to a full analysis.",
    tool: "Calculators",
    href: "/tools",
    duration: "~2 min",
    outputs: ["Memory ballpark", "Rough cost", "Carbon intensity"],
    nextHref: "/lens",
    nextLabel: "Define workload →",
  },
  {
    step: 1,
    id: "define",
    phase: "Define",
    title: "Describe the workload",
    question: "Which model, hardware, and traffic shape?",
    description:
      "Open Lens and define your AI workload — model, GPU, context length, QPS, batch size, and p99 SLO. This is the foundation every downstream decision builds on.",
    tool: "XARIV Lens",
    href: "/lens",
    duration: "~2 min",
    outputs: ["Workload spec", "Model & hardware catalog", "SLO targets"],
    nextHref: "/pulse",
    nextLabel: "Benchmark →",
  },
  {
    step: 2,
    id: "benchmark",
    phase: "Benchmark",
    title: "Profile real traffic",
    question: "Does this stack hit SLO on actual request patterns?",
    description:
      "Run Pulse on ShareGPT, LMSYS, or custom prompts. Collect TTFT, ITL, TPOT, throughput, and GPU telemetry — the evidence layer for your decision.",
    tool: "XARIV Pulse",
    href: "/pulse",
    duration: "~3 min",
    outputs: ["Latency percentiles", "Throughput under concurrency", "GPU telemetry"],
    nextHref: "/workflow#report",
    nextLabel: "View report →",
  },
  {
    step: 3,
    id: "analyze",
    phase: "Analyze",
    title: "Unified performance report",
    question: "What's the bottleneck and what should we change?",
    description:
      "Lens explains the binding constraint — memory, compute, or network — with ranked recommendations. Pulse validates whether the fix holds under real traffic.",
    tool: "Lens + Pulse",
    href: "/lens",
    duration: "~2 min",
    outputs: ["Bottleneck classification", "Utilization breakdown", "Optimization ranked list"],
    nextHref: "/contact?intent=report",
    nextLabel: "Export report →",
  },
  {
    step: 4,
    id: "decide",
    phase: "Decide",
    title: "Export architecture decision",
    question: "Why this GPU count, this cost, this carbon footprint?",
    description:
      "Package sizing, latency evidence, cost economics, and eco metrics into a report your team can approve — engineering, FinOps, and leadership on the same page.",
    tool: "Decision Report",
    href: "/contact?intent=report",
    duration: "~2 min",
    outputs: ["Procurement narrative", "Cost per request", "SLO confidence", "Carbon justification"],
    nextHref: "/contact?intent=demo",
    nextLabel: "Book demo →",
  },
];

export const workflowRoles = [
  {
    role: "Product Manager",
    entry: "Define",
    href: "/workflow",
    focus: "Set user growth and workload targets",
  },
  {
    role: "ML Engineer",
    entry: "Benchmark",
    href: "/pulse",
    focus: "Compare models and latency profiles",
  },
  {
    role: "Platform Engineer",
    entry: "Define",
    href: "/lens",
    focus: "GPU sizing and architecture",
  },
  {
    role: "SRE",
    entry: "Benchmark",
    href: "/pulse",
    focus: "Validate p99 SLO before cutover",
  },
  {
    role: "Finance / FinOps",
    entry: "Decide",
    href: "/contact?intent=report",
    focus: "Monthly GPU bill and cost per request",
  },
  {
    role: "Director / VP",
    entry: "Decide",
    href: "/contact?intent=report",
    focus: "Approve deployment with evidence",
  },
] as const;
