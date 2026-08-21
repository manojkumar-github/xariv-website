"use client";

import { useMemo, useState } from "react";
import {
  RELAY_DEMO_ANSWER,
  RELAY_DEMO_LEFT,
  RELAY_DEMO_PROMPT,
  RELAY_DEMO_RIGHT,
  wordsOf,
} from "@/data/relay-demo";

type PaneState = {
  text: string;
  ttftMs: number | null;
  tps: number | null;
  tokens: number;
  running: boolean;
};

const empty = (): PaneState => ({
  text: "",
  ttftMs: null,
  tps: null,
  tokens: 0,
  running: false,
});

type Profile = {
  name: string;
  variant: string;
  port: number;
  ttftMs: number;
  msPerWord: number;
};

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function replayPane(
  profile: Profile,
  setPane: (fn: (p: PaneState) => PaneState) => void,
) {
  const started = performance.now();
  setPane(() => ({ ...empty(), running: true }));
  await sleep(profile.ttftMs);
  const parts = wordsOf(RELAY_DEMO_ANSWER);
  let text = "";
  for (const part of parts) {
    text += part;
    const now = performance.now();
    const elapsed = (now - started) / 1000;
    const tokens = Math.max(1, Math.round(text.length / 4));
    setPane(() => ({
      text,
      tokens,
      ttftMs: profile.ttftMs,
      tps: elapsed > 0.05 ? tokens / elapsed : null,
      running: true,
    }));
    if (part.trim()) await sleep(profile.msPerWord);
  }
  setPane((p) => ({ ...p, running: false }));
}

export function RelayCompareStudio() {
  const [prompt, setPrompt] = useState(RELAY_DEMO_PROMPT);
  const [left, setLeft] = useState<PaneState>(empty);
  const [right, setRight] = useState<PaneState>(empty);
  const running = left.running || right.running;

  const leftP = useMemo(() => RELAY_DEMO_LEFT, []);
  const rightP = useMemo(() => RELAY_DEMO_RIGHT, []);

  async function runBoth() {
    await Promise.all([replayPane(leftP, setLeft), replayPane(rightP, setRight)]);
  }

  return (
    <div>
      <p className="eyebrow">XARIV Relay · Compare</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
        Same prompt. Two local candidates.
      </h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        Llama 3.2 1B — F16 vs Q4. This page replays a typical Mac Metal timing profile so you can
        show the speed gap without downloading weights on Vercel.
      </p>
      <p className="mt-3 rounded-lg border border-line bg-canvas-subtle px-4 py-3 text-xs text-muted">
        Illustrative replay (not live GPU inference in this browser). Edit the prompt below — both
        panes still stream the same canned answer so the speed gap stays clear. Real models cache in{" "}
        <code>~/.xariv/relay/models/</code>.
      </p>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <PaneLabel profile={leftP} />
        <PaneLabel profile={rightP} />
      </div>

      <textarea
        className="mt-4 w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm leading-relaxed disabled:opacity-60"
        rows={3}
        value={prompt}
        disabled={running}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter a prompt to send to both…"
      />

      <button
        type="button"
        disabled={running || !prompt.trim()}
        onClick={() => void runBoth()}
        className="mt-3 rounded-lg bg-cta-gradient px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
      >
        {running ? "Streaming…" : "Send to both"}
      </button>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Pane profile={leftP} state={left} />
        <Pane profile={rightP} state={right} />
      </div>
    </div>
  );
}

function PaneLabel({ profile }: { profile: Profile }) {
  return (
    <div className="rounded-lg border border-line bg-surface px-4 py-3 text-sm">
      <p className="text-xs font-semibold uppercase text-muted">
        {profile.port === 8090 ? "Left · baseline" : "Right · quantized"}
      </p>
      <p className="mt-1 font-medium text-ink">
        {profile.name} · {profile.variant}
      </p>
      <p className="text-xs text-muted">localhost:{profile.port}</p>
    </div>
  );
}

function Pane({ profile, state }: { profile: Profile; state: PaneState }) {
  return (
    <div className="flex min-h-[420px] flex-col rounded-xl border border-line bg-surface shadow-sm">
      <div className="border-b border-line px-4 py-3">
        <p className="font-semibold text-ink">
          {profile.name} · {profile.variant}
        </p>
        <p className="text-xs text-muted">localhost:{profile.port}</p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <Metric label="TTFT" value={state.ttftMs != null ? `${Math.round(state.ttftMs)} ms` : "—"} />
          <Metric label="tok/s" value={state.tps != null ? state.tps.toFixed(1) : "—"} />
          <Metric label="est. tokens" value={String(state.tokens || "—")} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 text-sm leading-relaxed text-ink-soft whitespace-pre-wrap">
        {state.text || <span className="text-muted">Output streams here…</span>}
        {state.running && <span className="ml-0.5 inline-block h-4 w-1 animate-pulse bg-accent" />}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-canvas-subtle px-2 py-1.5">
      <p className="text-[10px] uppercase tracking-wider text-muted">{label}</p>
      <p className="font-mono text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}
