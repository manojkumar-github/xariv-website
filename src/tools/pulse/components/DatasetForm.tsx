import { useState } from "react";
import { GPUS, MODELS } from "@/tools/engine/catalog";
import { datasetList, DATASETS } from "@/tools/pulse/engine/datasets";
import type { PulseSpec } from "@/tools/types";

const field =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand";
const label = "block text-xs font-medium uppercase tracking-wide text-slate-500 mb-1";

interface Props {
  loading: boolean;
  onSubmit: (s: PulseSpec) => void;
}

export default function DatasetForm({ loading, onSubmit }: Props) {
  const [spec, setSpec] = useState<PulseSpec>({
    model_id: "llama-3.3-70b",
    gpu_id: "h100-sxm",
    dtype: "fp8",
    concurrency: 32,
    num_requests: 500,
    dataset: "sharegpt",
    custom_text: "",
    custom_output_tokens: 128,
  });

  const set = (k: keyof PulseSpec, v: string | number) =>
    setSpec((s) => ({ ...s, [k]: v }));
  const num = (k: keyof PulseSpec) => (e: React.ChangeEvent<HTMLInputElement>) =>
    set(k, Number(e.target.value));

  const isCustom = spec.dataset === "custom";
  const preset = DATASETS[spec.dataset];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(spec);
      }}
      className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 shadow-sm"
    >
      <h2 className="font-display text-lg font-semibold">Profile a workload</h2>
      <p className="mt-1 text-sm text-slate-500">
        Pick a dataset and target hardware — Pulse replays the request mix and reports the
        latency profile and GPU telemetry.
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <label className={label}>Dataset</label>
          <select
            className={field}
            value={spec.dataset}
            onChange={(e) => set("dataset", e.target.value)}
          >
            {datasetList().map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          {preset && <p className="mt-1 text-xs text-slate-400">{preset.blurb}</p>}
        </div>

        {isCustom && (
          <div>
            <label className={label}>Your prompts (one per line)</label>
            <textarea
              className={`${field} h-28 font-mono text-xs`}
              placeholder={"Summarize my travel receipts from last month\nDraft a reply to the recruiter email\n..."}
              value={spec.custom_text}
              onChange={(e) => set("custom_text", e.target.value)}
            />
            <p className="mt-1 text-xs text-slate-400">
              Tokens estimated at ~4 chars/token. Leave empty to synthesize from the chosen
              size below.
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={label}>Model</label>
            <select
              className={field}
              value={spec.model_id}
              onChange={(e) => set("model_id", e.target.value)}
            >
              {Object.values(MODELS).map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                  {m.is_moe ? " · MoE" : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>GPU</label>
            <select
              className={field}
              value={spec.gpu_id}
              onChange={(e) => set("gpu_id", e.target.value)}
            >
              {Object.values(GPUS).map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Precision</label>
            <select
              className={field}
              value={spec.dtype}
              onChange={(e) => set("dtype", e.target.value as PulseSpec["dtype"])}
            >
              {["fp16", "fp8", "int8", "int4"].map((d) => (
                <option key={d} value={d}>
                  {d.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Concurrency</label>
            <input
              type="number"
              min={1}
              className={field}
              value={spec.concurrency}
              onChange={num("concurrency")}
            />
          </div>
          {isCustom ? (
            <div>
              <label className={label}>Output tokens</label>
              <input
                type="number"
                min={1}
                className={field}
                value={spec.custom_output_tokens}
                onChange={num("custom_output_tokens")}
              />
            </div>
          ) : (
            <div>
              <label className={label}>Requests</label>
              <input
                type="number"
                min={1}
                className={field}
                value={spec.num_requests}
                onChange={num("num_requests")}
              />
            </div>
          )}
          {isCustom && (
            <div>
              <label className={label}>Requests</label>
              <input
                type="number"
                min={1}
                className={field}
                value={spec.num_requests}
                onChange={num("num_requests")}
              />
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-lg bg-ink py-2.5 font-medium text-white transition hover:bg-brand disabled:opacity-60"
      >
        {loading ? "Profiling…" : "Run Pulse profile"}
      </button>
    </form>
  );
}
