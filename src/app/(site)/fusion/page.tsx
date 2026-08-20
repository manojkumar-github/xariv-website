import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Fusion Studio",
  description:
    "Visualize llama.cpp Metal kernel fusion — fewer GPU launches, faster decode on your Mac.",
};

export default function FusionPublicPage() {
  return (
    <Section className="pt-16">
      <p className="eyebrow">XARIV Fusion Studio</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink md:text-5xl">
        See kernel fusion — not just read about it
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-soft">
        Replay one decode step side by side: hundreds of micro-kernel launches vs fused Metal blocks
        from llama.cpp. Timings are scaled from local <code className="rounded bg-code-bg px-1">llama-bench</code>{" "}
        on Apple Silicon.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/fusion/compare" size="lg">
          Run fusion compare
        </Button>
        <Button href="/architecture-studies/kernel-fusion-llm-inference" variant="secondary" size="lg">
          Read the study
        </Button>
      </div>
      <ul className="mt-12 max-w-xl space-y-3 text-sm text-ink-soft">
        <li>
          <strong className="text-ink">Browser replay:</strong> kernel timeline + launch counters — works on Vercel.
        </li>
        <li>
          <strong className="text-ink">Your Mac:</strong> toggle real fusion with{" "}
          <code className="rounded bg-code-bg px-1">GGML_METAL_FUSION_DISABLE=1</code> and{" "}
          <code className="rounded bg-code-bg px-1">llama-bench</code>.
        </li>
      </ul>
      <p className="mt-8">
        <Link href="/relay" className="text-sm font-medium text-accent hover:underline">
          ← XARIV Relay (quantization compare)
        </Link>
      </p>
    </Section>
  );
}
