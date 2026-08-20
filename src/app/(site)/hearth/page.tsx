import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Hearth",
  description:
    "Host a ChatGPT-like app entirely on your Mac — small open models via llama.cpp, powered by XARIV Relay.",
};

export default function HearthPublicPage() {
  return (
    <Section className="pt-16">
      <p className="eyebrow">XARIV Hearth</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink md:text-5xl">
        Own your chat.<br />Keep it on your Mac.
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-soft">
        A ChatGPT-like experience that runs entirely locally — small 1–3B open models through
        llama.cpp and Metal. Your prompts never leave your machine. Inspired by the local-first
        idea behind products like{" "}
        <a
          href="https://osaurus.ai/"
          className="font-medium text-accent hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Osaurus
        </a>
        , but wired into the XARIV control plane.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/app/hearth" size="lg">
          Open Hearth (local)
        </Button>
        <Button href="/app/relay" variant="secondary" size="lg">
          Manage models
        </Button>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Private by default",
            body: "Inference runs on localhost via llama-server. No telemetry, no training on your data.",
          },
          {
            title: "Small models first",
            body: "Llama 3.2 1B–3B GGUFs — fast enough on Apple Silicon for daily chat and demos.",
          },
          {
            title: "Relay underneath",
            body: "Download, deploy, and compare models with XARIV Relay. Fine-tune and publish later.",
          },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border border-line bg-surface p-5 shadow-sm">
            <h2 className="font-semibold text-ink">{item.title}</h2>
            <p className="mt-2 text-sm text-ink-soft">{item.body}</p>
          </div>
        ))}
      </div>

      <ul className="mt-12 max-w-xl space-y-3 text-sm text-ink-soft">
        <li>
          <strong className="text-ink">Today:</strong> browser chat at{" "}
          <code className="rounded bg-code-bg px-1">/app/hearth</code> while Pulse + llama.cpp run
          locally.
        </li>
        <li>
          <strong className="text-ink">Next:</strong> packaged{" "}
          <code className="rounded bg-code-bg px-1">XARIV Hearth.app</code> (.dmg) — same stack,
          no terminal.
        </li>
        <li>
          <strong className="text-ink">Later:</strong> fine-tune with Relay, host and publish your
          own models.
        </li>
      </ul>

      <p className="mt-8">
        <Link href="/relay" className="text-sm font-medium text-accent hover:underline">
          ← XARIV Relay (serving engine)
        </Link>
      </p>
    </Section>
  );
}
