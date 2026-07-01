export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readingTime: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "inference-serving-primitives",
    title: "Prefill, Decode, and the Two Regimes of LLM Serving",
    excerpt:
      "Why autoregressive serving has two distinct performance regimes — and why conflating them leads to wrong capacity plans.",
    date: "2026-06-10",
    category: "Distributed Inference",
    readingTime: "8 min",
  },
  {
    slug: "kv-cache-economics",
    title: "KV Cache Economics at Scale",
    excerpt:
      "How context length, batch size, and GQA interact to determine whether your cluster is weight-bound or cache-bound.",
    date: "2026-06-05",
    category: "Capacity Planning",
    readingTime: "10 min",
  },
  {
    slug: "tensorrt-vs-vllm",
    title: "TensorRT-LLM vs vLLM: When Each Runtime Wins",
    excerpt:
      "A practical comparison for teams choosing a production inference stack — latency, throughput, and operational trade-offs.",
    date: "2026-05-28",
    category: "TensorRT",
    readingTime: "12 min",
  },
  {
    slug: "agentic-workload-patterns",
    title: "Infrastructure Patterns for Agentic AI Workloads",
    excerpt:
      "Multi-step tool use changes the request distribution. What that means for GPU sizing, caching, and tail latency.",
    date: "2026-05-20",
    category: "Agentic AI",
    readingTime: "9 min",
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
