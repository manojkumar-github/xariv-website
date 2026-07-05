export const outcomes = [
  {
    value: "38%",
    label: "fewer GPUs provisioned",
    detail: "Right-sized a 70B MoE fleet before procurement",
  },
  {
    value: "42%",
    label: "p99 latency reduction",
    detail: "Identified memory-bandwidth bottleneck pre-deployment",
  },
  {
    value: "$2.1M",
    label: "annual infra savings",
    detail: "Avoided over-provisioned H100 cluster for chat workload",
  },
] as const;

export const testimonial = {
  quote:
    "We stopped guessing GPU counts. XARIV Lens surfaced the memory-bandwidth constraint our spreadsheet model missed — and Pulse validated the fix before we cut a PO.",
  author: "Head of ML Platform",
  company: "Fortune 500 Retailer",
} as const;

export const customerLogos = [
  { name: "Global Retail Co." },
  { name: "AI Research Lab" },
  { name: "Series B Startup" },
  { name: "Cloud-Native SaaS" },
  { name: "Enterprise FinServ" },
] as const;

export const caseStudy = {
  customer: "Global e-commerce platform",
  problem:
    "Planning a 32B chat model rollout on H100s with a 500ms p99 SLO — team estimated 48 GPUs from spreadsheet math.",
  solution:
    "Lens predicted a memory-bandwidth bottleneck at 28 GPUs; Pulse replayed ShareGPT traffic and confirmed p99 at 31 GPUs with tensor parallelism.",
  result: "Provisioned 31 GPUs instead of 48 — 35% capex reduction with SLO met on day one.",
} as const;

export const audiences = [
  {
    title: "Researchers & Data Scientists",
    problem: "Will this model fit on available hardware?",
    cta: "Try Lens",
    href: "/lens",
  },
  {
    title: "ML Engineers",
    problem: "Where is the bottleneck — compute, memory, or network?",
    cta: "Run Pulse",
    href: "/pulse",
  },
  {
    title: "Platform & Infra Leads",
    problem: "How many GPUs, at what cost, with what headroom?",
    cta: "Try Lens",
    href: "/lens",
  },
  {
    title: "Startups",
    problem: "Size inference before your first cluster purchase.",
    cta: "Free calculators",
    href: "/tools",
  },
  {
    title: "Enterprise & FinOps",
    problem: "Justify GPU spend with modeled cost per request.",
    cta: "Book demo",
    href: "/contact?intent=demo",
  },
] as const;
