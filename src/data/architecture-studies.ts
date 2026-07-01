export interface Study {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readingTime: string;
  author: string;
}

export const architectureStudies: Study[] = [
  {
    slug: "multi-model-inference-platform",
    title:
      "Serving Hundreds of LLMs at Scale: Architecting a Multi-Model Inference Platform Across Heterogeneous GPUs",
    excerpt:
      "Hundreds of models, ten thousand GPUs, a nine-figure compute bill — and almost every design decision turns out to be one dial: how much do you pay, in money or complexity, to protect latency?",
    date: "2026-06-22",
    category: "AI Infrastructure",
    readingTime: "28 min",
    author: "Xariv Infrastructure",
  },
  {
    slug: "benchmarking-llms-at-scale",
    title:
      "Benchmarking LLMs at Scale: Architecting a Reproducible, GPU-Efficient Platform for Hundreds of Models a Day",
    excerpt:
      "Hundreds of models, thousands of GPUs, a multi-million-dollar compute bill — and yet the scheduler dispatches about once a second. The hard part isn't throughput. It's trusting the number.",
    date: "2026-06-20",
    category: "AI Infrastructure",
    readingTime: "24 min",
    author: "Xariv Infrastructure",
  },
  {
    slug: "per-user-rag-at-scale",
    title:
      "Per-User RAG at Scale: Architecting a Private AI Inbox for 220M Users and Billions of Queries a Day",
    excerpt:
      "It looks read-heavy. It isn't. A per-user RAG at 220M-user scale is write-dominated, the LLM bill dwarfs the infrastructure, and one partitioning decision quietly solves four problems at once.",
    date: "2026-06-18",
    category: "AI Infrastructure",
    readingTime: "32 min",
    author: "Xariv Infrastructure",
  },
  {
    slug: "kernel-fusion-llm-inference",
    title:
      "Kernel Fusion for Large-Scale LLM Inference: When GPU Memory Bandwidth, Not Compute, Is the Bottleneck",
    excerpt:
      "A single H100, a 32B model, billions of short answers a day — and GPUs that looked busy but weren't fast. The bottleneck wasn't compute. It was memory bandwidth.",
    date: "2026-06-16",
    category: "AI Infrastructure",
    readingTime: "18 min",
    author: "Xariv Infrastructure",
  },
  {
    slug: "networking-moe-inference",
    title:
      "Networking Bottlenecks in Large-Scale Mixture-of-Experts (MoE) Inference",
    excerpt:
      "Why adding GPUs stopped improving throughput in a 235B-parameter MoE platform — and how the bottleneck turned out to live in the network, not the GPU.",
    date: "2026-06-14",
    category: "AI Infrastructure",
    readingTime: "22 min",
    author: "Manoj Kumar",
  },
];

export function getStudy(slug: string): Study | undefined {
  return architectureStudies.find((s) => s.slug === slug);
}
