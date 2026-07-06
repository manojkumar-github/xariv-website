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
  "The planning layer between model selection and GPU procurement.";

export const workflowSteps: WorkflowStep[] = [
  {
    step: 0,
    id: "estimate",
    phase: "Estimate",
    title: "Quick sanity checks",
    question: "Does this workload roughly fit?",
    description:
      "Run free calculators for KV cache, GPU memory, cost, throughput, and eco impact. Under 30 seconds each — enough to know if you are in the right ballpark before deeper analysis.",
    tool: "Infrastructure calculators",
    href: "/tools",
    duration: "~2 min",
    outputs: ["KV cache size", "GPU memory breakdown", "Rough cost & carbon"],
    nextHref: "/lens",
    nextLabel: "Continue to Plan →",
  },
  {
    step: 1,
    id: "plan",
    phase: "Plan",
    title: "Predict before you provision",
    question: "How many GPUs, at what cost, with what bottleneck?",
    description:
      "Describe your workload in Lens. XARIV simulates sizing, economics, latency SLOs, utilization, and environmental impact — with explainable recommendations and the reasoning behind every number.",
    tool: "XARIV Lens",
    href: "/lens",
    duration: "~5 min",
    outputs: [
      "GPUs needed & replicas",
      "Monthly cost & power",
      "Bottleneck classification",
      "Eco impact rating",
    ],
    nextHref: "/pulse",
    nextLabel: "Continue to Validate →",
  },
  {
    step: 2,
    id: "validate",
    phase: "Validate",
    title: "Profile real traffic",
    question: "Does this stack hit your SLO on actual request patterns?",
    description:
      "Replay ShareGPT, LMSYS, or your own prompts in Pulse. Get TTFT, ITL, TPOT, p99 latency, throughput, and GPU telemetry — before you serve a single production request.",
    tool: "XARIV Pulse",
    href: "/pulse",
    duration: "~5 min",
    outputs: [
      "Latency percentiles (p50/p90/p99)",
      "Aggregate throughput",
      "GPU utilization & power",
      "Dataset replay metrics",
    ],
    nextHref: "/workflow#justify",
    nextLabel: "Continue to Justify →",
  },
  {
    step: 3,
    id: "justify",
    phase: "Justify",
    title: "Decision report for stakeholders",
    question: "Why this GPU count, this cost, this carbon footprint?",
    description:
      "Combine Lens predictions and Pulse profiles into a defensible infrastructure decision. Share cost per request, bottleneck analysis, and eco metrics with engineering, FinOps, and procurement before the PO.",
    tool: "Infrastructure Decision Report",
    href: "/contact?intent=report",
    duration: "~2 min",
    outputs: [
      "Right-sized GPU fleet",
      "Cost & carbon justification",
      "SLO confidence summary",
      "Procurement-ready narrative",
    ],
    nextHref: "/contact?intent=demo",
    nextLabel: "Book demo →",
  },
];

export const workflowRoles = [
  {
    role: "Data scientist / researcher",
    entry: "Estimate",
    href: "/tools",
    focus: "Model fit and memory ballpark",
  },
  {
    role: "ML / serving engineer",
    entry: "Validate",
    href: "/pulse",
    focus: "Latency profile and bottlenecks",
  },
  {
    role: "Platform / infra lead",
    entry: "Plan",
    href: "/lens",
    focus: "GPU sizing and architecture",
  },
  {
    role: "FinOps / procurement",
    entry: "Justify",
    href: "/contact?intent=report",
    focus: "Cost per request and PO approval",
  },
] as const;
