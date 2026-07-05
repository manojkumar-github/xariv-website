import { useState } from "react";
import { toolButton, toolCard, toolField, toolLabel } from "@/components/tools/styles";
import type { Catalog, WorkloadSpec } from "@/tools/types";

interface Props {
  catalog: Catalog;
  loading: boolean;
  onSubmit: (s: WorkloadSpec) => void;
}

export default function WorkloadForm({ catalog, loading, onSubmit }: Props) {
  const [spec, setSpec] = useState<WorkloadSpec>({
    model_id: "qwen3-32b",
    gpu_id: "h100-sxm",
    network_id: "nvlink",
    dtype: "fp8",
    context_length: 2048,
    output_tokens: 40,
    qps: 1000,
    batch_size: 32,
    p99_target_ms: 500,
  });
  const set = (k: keyof WorkloadSpec, v: string | number) =>
    setSpec((s) => ({ ...s, [k]: v }));
  const num =
    (k: keyof WorkloadSpec) => (e: React.ChangeEvent<HTMLInputElement>) =>
      set(k, Number(e.target.value));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(spec);
      }}
      className={toolCard}
    >
      <h2 className="font-display text-lg font-medium text-ink">Describe your workload</h2>
      <p className="mt-1 text-sm text-muted">
        The platform predicts the result before you provision a single GPU.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <label className={toolLabel}>Model</label>
          <select
            className={toolField}
            value={spec.model_id}
            onChange={(e) => set("model_id", e.target.value)}
          >
            {catalog.models.map((m) => (
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
            {catalog.gpus.map((g) => (
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
            onChange={(e) => set("dtype", e.target.value as WorkloadSpec["dtype"])}
          >
            {["fp16", "fp8", "int8", "int4"].map((d) => (
              <option key={d} value={d}>
                {d.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={toolLabel}>Fabric</label>
          <select
            className={toolField}
            value={spec.network_id}
            onChange={(e) => set("network_id", e.target.value)}
          >
            {catalog.networks.map((n) => (
              <option key={n.id} value={n.id}>
                {n.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={toolLabel}>Context length</label>
          <input
            type="number"
            className={toolField}
            value={spec.context_length}
            onChange={num("context_length")}
          />
        </div>
        <div>
          <label className={toolLabel}>Output tokens</label>
          <input
            type="number"
            className={toolField}
            value={spec.output_tokens}
            onChange={num("output_tokens")}
          />
        </div>
        <div>
          <label className={toolLabel}>Peak QPS</label>
          <input type="number" className={toolField} value={spec.qps} onChange={num("qps")} />
        </div>
        <div>
          <label className={toolLabel}>Batch / replica</label>
          <input
            type="number"
            className={toolField}
            value={spec.batch_size}
            onChange={num("batch_size")}
          />
        </div>
        <div className="col-span-2">
          <label className={toolLabel}>p99 latency target (ms)</label>
          <input
            type="number"
            className={toolField}
            value={spec.p99_target_ms}
            onChange={num("p99_target_ms")}
          />
        </div>
      </div>

      <button type="submit" disabled={loading} className={`mt-6 ${toolButton}`}>
        {loading ? "Predicting…" : "Predict infrastructure"}
      </button>
    </form>
  );
}
