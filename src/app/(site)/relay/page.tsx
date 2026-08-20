import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Relay",
  description:
    "Serve open-weight models on your own Mac, or replay a F16 vs Q4 speed compare in the browser.",
};

export default function RelayPublicPage() {
  return (
    <Section className="pt-16">
      <p className="eyebrow">XARIV Relay</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink md:text-5xl">
        Open weights on your machine — not our GPUs
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-soft">
        Download a GGUF, deploy llama.cpp on localhost, then compare two candidates side by side.
        Vercel cannot host model files or llama-server, so the public site ships a timing replay for
        demos.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/relay/compare" size="lg">
          Compare F16 vs Q4
        </Button>
        <Button href="/fusion/compare" variant="secondary" size="lg">
          Kernel fusion replay
        </Button>
        <Button href="/app/relay" variant="secondary" size="lg">
          Live local deploy
        </Button>
      </div>
      <ul className="mt-12 max-w-xl space-y-3 text-sm text-ink-soft">
        <li>
          <strong className="text-ink">Website (this page):</strong> split-pane speed demo, no
          download.
        </li>
        <li>
          <strong className="text-ink">Your Mac:</strong> real weights cache in{" "}
          <code className="rounded bg-code-bg px-1">~/.xariv/relay/models/</code> after the first
          Hugging Face fetch — Deploy does not re-download if the file is already there.
        </li>
      </ul>
      <p className="mt-8">
        <Link href="/docs" className="text-sm font-medium text-accent hover:underline">
          Docs →
        </Link>
      </p>
    </Section>
  );
}
