import { useState } from "react";
import type { Catalog, WorkloadSpec } from "@/tools/types";

const field = "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand focus:ring-1 focus:ring-brand";
const label = "block text-xs font-medium uppercase tracking-wide text-slate-500 mb-1";

interface Props { catalog: Catalog; loading: boolean; onSubmit: (s: WorkloadSpec) => void; }

export default function WorkloadForm({ catalog, loading, onSubmit }: Props) {
  const [spec, setSpec] = useState<WorkloadSpec>({
    model_id: "qwen3-32b", gpu_id: "h100-sxm", network_id: "nvlink",
    dtype: "fp8", context_length: 2048, output_tokens: 40,
    qps: 1000, batch_size: 32, p99_target_ms: 500,
  });
  const set = (k: keyof WorkloadSpec, v: string | number) => setSpec((s) => ({ ...s, [k]: v }));
  const num = (k: keyof WorkloadSpec) => (e: React.ChangeEvent<HTMLInputElement>) => set(k, Number(e.target.value));

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(spec); }}
      className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 shadow-sm"
    >
      <h2 className="font-display text-lg font-semibold">Describe your workload</h2>
      <p className="mt-1 text-sm text-slate-500">The platform predicts the result before you provision a single GPU.</p>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Model</label>
          <select className={field} value={spec.model_id} onChange={(e) => set("model_id", e.target.value)}>
            {catalog.models.map((m) => <option key={m.id} value={m.id}>{m.name}{m.is_moe ? " · MoE" : ""}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>GPU</label>
          <select className={field} value={spec.gpu_id} onChange={(e) => set("gpu_id", e.target.value)}>
            {catalog.gpus.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>Precision</label>
          <select className={field} value={spec.dtype} onChange={(e) => set("dtype", e.target.value as WorkloadSpec["dtype"])}>
            {["fp16", "fp8", "int8", "int4"].map((d) => <option key={d} value={d}>{d.toUpperCase()}</option>)}
          </select>
        </div>
        <div>
          <label className={label}>Fabric</label>
          <select className={field} value={spec.network_id} onChange={(e) => set("network_id", e.target.value)}>
            {catalog.networks.map((n) => <option key={n.id} value={n.id}>{n.name}</option>)}
          </select>
        </div>
        <div><label className={label}>Context length</label><input type="number" className={field} value={spec.context_length} onChange={num("context_length")} /></div>
        <div><label className={label}>Output tokens</label><input type="number" className={field} value={spec.output_tokens} onChange={num("output_tokens")} /></div>
        <div><label className={label}>Peak QPS</label><input type="number" className={field} value={spec.qps} onChange={num("qps")} /></div>
        <div><label className={label}>Batch / replica</label><input type="number" className={field} value={spec.batch_size} onChange={num("batch_size")} /></div>
        <div className="col-span-2"><label className={label}>p99 latency target (ms)</label><input type="number" className={field} value={spec.p99_target_ms} onChange={num("p99_target_ms")} /></div>
      </div>

      <button
        type="submit" disabled={loading}
        className="mt-6 w-full rounded-lg bg-ink py-2.5 font-medium text-white transition hover:bg-brand disabled:opacity-60"
      >
        {loading ? "Predicting…" : "Predict infrastructure"}
      </button>
    </form>
  );
}
