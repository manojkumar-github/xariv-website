"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  buildDecodeProfile,
  FUSION_DEMO_MODELS,
  KERNEL_COLORS,
  type DecodeProfile,
  type KernelEvent,
} from "@/data/fusion-demo";

type PaneState = {
  launched: number;
  elapsedMs: number;
  launchOverheadMs: number;
  visible: KernelEvent[];
  running: boolean;
  done: boolean;
};

const emptyPane = (): PaneState => ({
  launched: 0,
  elapsedMs: 0,
  launchOverheadMs: 0,
  visible: [],
  running: false,
  done: false,
});

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function replayProfile(
  profile: DecodeProfile,
  setPane: (fn: (p: PaneState) => PaneState) => void,
) {
  setPane(() => ({ ...emptyPane(), running: true }));
  let launched = 0;
  let logicalMs = 0;
  let launchOverheadMs = 0;
  const visible: KernelEvent[] = [];
  const batch = profile.fused ? 1 : 4;
  /** Wall-clock stretch so launches are visible (~3–5s), metrics stay on real step time. */
  const wallTargetMs = profile.fused ? 2800 : 4200;
  const speed = profile.stepMs / wallTargetMs;

  for (let i = 0; i < profile.kernels.length; i += 1) {
    const k = profile.kernels[i];
    await sleep((k.launchMs + k.workMs) / speed);
    launched += 1;
    logicalMs += k.launchMs + k.workMs;
    launchOverheadMs += k.launchMs;
    visible.push(k);
    if (launched % batch === 0 || i === profile.kernels.length - 1) {
      const snap = [...visible];
      setPane(() => ({
        launched,
        elapsedMs: logicalMs,
        launchOverheadMs,
        visible: snap,
        running: true,
        done: false,
      }));
    }
  }

  setPane((p) => ({ ...p, running: false, done: true }));
}

export function FusionCompareStudio() {
  const [modelId, setModelId] = useState(FUSION_DEMO_MODELS[0].id);
  const [left, setLeft] = useState<PaneState>(emptyPane);
  const [right, setRight] = useState<PaneState>(emptyPane);

  const model = useMemo(
    () => FUSION_DEMO_MODELS.find((m) => m.id === modelId) ?? FUSION_DEMO_MODELS[0],
    [modelId],
  );
  const unfused = useMemo(() => buildDecodeProfile(model, false), [model]);
  const fused = useMemo(() => buildDecodeProfile(model, true), [model]);
  const running = left.running || right.running;

  async function runBoth() {
    setLeft(emptyPane());
    setRight(emptyPane());
    await Promise.all([replayProfile(unfused, setLeft), replayProfile(fused, setRight)]);
  }

  return (
    <div>
      <p className="eyebrow">XARIV Fusion Studio</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
        One decode step. Hundreds of kernels vs a dozen fused blocks.
      </h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        Pick a cached Llama 3.2 1B GGUF and replay how llama.cpp Metal fusion collapses micro-ops
        into fewer GPU launches — the same idea as our{" "}
        <Link
          href="/architecture-studies/kernel-fusion-llm-inference"
          className="font-medium text-accent hover:underline"
        >
          kernel fusion study
        </Link>
        , scaled down for edge inference.
      </p>
      <p className="mt-3 rounded-lg border border-line bg-canvas-subtle px-4 py-3 text-xs text-muted">
        Illustrative replay (not a live Metal trace). Timings are scaled from local{" "}
        <code className="rounded bg-code-bg px-1">llama-bench</code> on Apple Silicon with fusion
        on vs <code className="rounded bg-code-bg px-1">GGML_METAL_FUSION_DISABLE=1</code>. Real
        weights live in <code className="rounded bg-code-bg px-1">~/.xariv/relay/models/</code>.
      </p>

      <div className="mt-6 flex flex-wrap items-end gap-4">
        <label className="block text-sm">
          <span className="mb-1 block text-xs font-semibold uppercase text-muted">Model</span>
          <select
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
            disabled={running}
            className="rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink disabled:opacity-50"
          >
            {FUSION_DEMO_MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} · {m.variant}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          disabled={running}
          onClick={() => void runBoth()}
          className="rounded-lg bg-cta-gradient px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
        >
          {running ? "Running decode step…" : "Run decode step on both"}
        </button>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <ProfileLabel profile={unfused} side="left" />
        <ProfileLabel profile={fused} side="right" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <FusionPane profile={unfused} state={left} />
        <FusionPane profile={fused} state={right} />
      </div>

      {!running && (left.done || right.done) && (
        <div className="mt-6 rounded-xl border border-accent/20 bg-accent-muted/40 px-5 py-4 text-sm text-ink-soft">
          <p className="font-medium text-ink">Summary</p>
          <p className="mt-1">
            Unfused launched <strong className="text-ink">{unfused.kernelCount}</strong> kernels with{" "}
            <strong className="text-ink">{unfused.launchOverheadMs.toFixed(1)} ms</strong> launch
            overhead → ~{unfused.tokPerSec.toFixed(1)} tok/s. Fused launched{" "}
            <strong className="text-ink">{fused.kernelCount}</strong> blocks with{" "}
            <strong className="text-ink">{fused.launchOverheadMs.toFixed(1)} ms</strong> overhead →
            ~{fused.tokPerSec.toFixed(1)} tok/s (
            {((fused.tokPerSec / unfused.tokPerSec - 1) * 100).toFixed(0)}% faster on this profile).
          </p>
        </div>
      )}
    </div>
  );
}

function ProfileLabel({ profile, side }: { profile: DecodeProfile; side: "left" | "right" }) {
  return (
    <div className="rounded-lg border border-line bg-surface px-4 py-3 text-sm">
      <p className="text-xs font-semibold uppercase text-muted">
        {side === "left" ? "Left · unfused" : "Right · fused"}
      </p>
      <p className="mt-1 font-medium text-ink">{profile.label}</p>
      <p className="text-xs text-muted">{profile.subtitle}</p>
    </div>
  );
}

function FusionPane({ profile, state }: { profile: DecodeProfile; state: PaneState }) {
  const progress = state.launched / profile.kernelCount;
  const timeline = useMemo(() => buildTimeline(profile.kernels, state.visible.length), [profile.kernels, state.visible.length]);

  return (
    <div className="flex min-h-[480px] flex-col rounded-xl border border-line bg-surface shadow-sm">
      <div className="border-b border-line px-4 py-3">
        <p className="font-semibold text-ink">{profile.label}</p>
        <p className="text-xs text-muted">{profile.kernelCount} launches · target {profile.stepMs.toFixed(1)} ms / step</p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Metric
            label="Launched"
            value={state.running || state.done ? String(state.launched) : "—"}
            sub={`/ ${profile.kernelCount}`}
          />
          <Metric
            label="Launch overhead"
            value={
              state.launchOverheadMs > 0 ? `${state.launchOverheadMs.toFixed(1)} ms` : "—"
            }
          />
          <Metric
            label="Step time"
            value={state.elapsedMs > 0 ? `${state.elapsedMs.toFixed(1)} ms` : "—"}
          />
          <Metric
            label="tok/s"
            value={
              state.elapsedMs > 0 ? (1000 / state.elapsedMs).toFixed(1) : profile.tokPerSec.toFixed(1)
            }
          />
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-canvas-subtle">
          <div
            className="h-full rounded-full bg-accent transition-all duration-75"
            style={{ width: `${Math.min(100, progress * 100)}%` }}
          />
        </div>
      </div>

      <div className="border-b border-line px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">Kernel timeline</p>
        <div className="mt-2 h-14 overflow-hidden rounded-lg bg-canvas-subtle">
          <svg viewBox="0 0 1000 56" className="h-full w-full" preserveAspectRatio="none">
            {timeline.map((seg, i) => (
              <rect
                key={`${seg.name}-${i}`}
                x={seg.x}
                y={8}
                width={Math.max(1, seg.w)}
                height={40}
                rx={profile.fused ? 3 : 1}
                fill={KERNEL_COLORS[seg.category]}
                opacity={0.92}
              />
            ))}
          </svg>
        </div>
        <Legend />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 font-mono text-[11px] leading-relaxed text-ink-soft">
        {state.visible.length === 0 && !state.running && (
          <span className="text-muted">Kernel launch log appears here…</span>
        )}
        {state.visible.slice(-24).map((k, i) => (
          <div key={`${k.name}-${state.visible.length - 24 + i}`} className="flex gap-2">
            <span className="text-muted">{String(state.visible.length - 24 + i + 1).padStart(3, " ")}</span>
            <span style={{ color: KERNEL_COLORS[k.category] }}>{k.name}</span>
            <span className="text-muted">
              +{(k.launchMs + k.workMs).toFixed(2)} ms
            </span>
          </div>
        ))}
        {state.running && <span className="ml-0.5 inline-block h-3 w-1 animate-pulse bg-accent" />}
      </div>
    </div>
  );
}

type TimelineSeg = { name: string; category: KernelEvent["category"]; x: number; w: number };

function buildTimeline(all: KernelEvent[], count: number): TimelineSeg[] {
  const slice = all.slice(0, count);
  const total = all.reduce((s, k) => s + k.launchMs + k.workMs, 0) || 1;
  let x = 0;
  return slice.map((k) => {
    const dur = k.launchMs + k.workMs;
    const w = (dur / total) * 1000;
    const seg = { name: k.name, category: k.category, x, w };
    x += w;
    return seg;
  });
}

function Legend() {
  const items: { cat: keyof typeof KERNEL_COLORS; label: string }[] = [
    { cat: "fuse", label: "fused" },
    { cat: "matmul", label: "matmul" },
    { cat: "attn", label: "attn" },
    { cat: "norm", label: "norm" },
    { cat: "view", label: "view/reshape" },
  ];
  return (
    <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-muted">
      {items.map(({ cat, label }) => (
        <span key={cat} className="inline-flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-sm" style={{ background: KERNEL_COLORS[cat] }} />
          {label}
        </span>
      ))}
    </div>
  );
}

function Metric({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg bg-canvas-subtle px-2 py-1.5">
      <p className="text-[10px] uppercase tracking-wider text-muted">{label}</p>
      <p className="font-mono text-sm font-semibold text-ink">
        {value}
        {sub && <span className="text-xs font-normal text-muted"> {sub}</span>}
      </p>
    </div>
  );
}
