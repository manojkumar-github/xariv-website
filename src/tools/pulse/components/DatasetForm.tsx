import { useState } from "react";
import { toolButton, toolCard, toolField, toolLabel } from "@/components/tools/styles";
import { GPUS, MODELS } from "@/tools/engine/catalog";
import { datasetList, DATASETS } from "@/tools/pulse/engine/datasets";
import type { PulseSpec } from "@/tools/types";

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
  const num =
    (k: keyof PulseSpec) => (e: React.ChangeEvent<HTMLInputElement>) =>
      set(k, Number(e.target.value));

  const isCustom = spec.dataset === "custom";
  const preset = DATASETS[spec.dataset];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(spec);
      }}
      className={toolCard}
    >
      <h2 className="font-display text-lg font-medium text-ink">Profile a workload</h2>
      <p className="mt-1 text-sm text-muted">
        Pick a dataset and target hardware — Pulse replays the request mix and reports the
        latency profile and GPU telemetry.
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <label className={toolLabel}>Dataset</label>
          <select
            className={toolField}
            value={spec.dataset}
            onChange={(e) => set("dataset", e.target.value)}
          >
            {datasetList().map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          {preset && <p className="mt-1 text-xs text-muted">{preset.blurb}</p>}
        </div>

        {isCustom && (
          <div>
            <label className={toolLabel}>Your prompts (one per line)</label>
            <textarea
              className={`${toolField} h-28 font-mono text-xs`}
              placeholder={
                "Summarize my travel receipts from last month\nDraft a reply to the recruiter email\n..."
              }
              value={spec.custom_text}
              onChange={(e) => set("custom_text", e.target.value)}
            />
            <p className="mt-1 text-xs text-muted">
              Tokens estimated at ~4 chars/token. Leave empty to synthesize from the chosen
              size below.
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={toolLabel}>Model</label>
            <select
              className={toolField}
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
            <label className={toolLabel}>GPU</label>
            <select
              className={toolField}
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
            <label className={toolLabel}>Precision</label>
            <select
              className={toolField}
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
            <label className={toolLabel}>Concurrency</label>
            <input
              type="number"
              min={1}
              className={toolField}
              value={spec.concurrency}
              onChange={num("concurrency")}
            />
          </div>
          {isCustom ? (
            <div>
              <label className={toolLabel}>Output tokens</label>
              <input
                type="number"
                min={1}
                className={toolField}
                value={spec.custom_output_tokens}
                onChange={num("custom_output_tokens")}
              />
            </div>
          ) : (
            <div>
              <label className={toolLabel}>Requests</label>
              <input
                type="number"
                min={1}
                className={toolField}
                value={spec.num_requests}
                onChange={num("num_requests")}
              />
            </div>
          )}
          {isCustom && (
            <div>
              <label className={toolLabel}>Requests</label>
              <input
                type="number"
                min={1}
                className={toolField}
                value={spec.num_requests}
                onChange={num("num_requests")}
              />
            </div>
          )}
        </div>
      </div>

      <button type="submit" disabled={loading} className={`mt-6 ${toolButton}`}>
        {loading ? "Profiling…" : "Run Pulse profile"}
      </button>
    </form>
  );
}
