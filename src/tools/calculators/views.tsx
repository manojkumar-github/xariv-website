"use client";

import { useMemo, useState } from "react";
import { MODELS, GPUS } from "@/tools/engine/catalog";
import type { Dtype } from "@/tools/types";
import {
  kvCacheGb,
  kvPerTokenBytes,
  weightsGb,
  estimateAggregateTps,
  estimateTtftMs,
  gpusNeededForMemory,
  monthlyGpuCost,
  modelOptions,
  gpuOptions,
  dtypeOptions,
  peakFlops,
  computeEcoMetrics,
  ecoImpactRating,
  ecoMetricRows,
} from "@/tools/calculators/math";
import { DTYPE_BYTES, MBU, MFU } from "@/tools/engine/constants";
import {
  CalculatorShell,
  CalcForm,
  CalcSelect,
  CalcNumber,
  CalcResults,
} from "@/components/calculators/CalculatorShell";
import type { CalculatorMeta } from "@/data/calculators";

function useModelGpu() {
  const [modelId, setModelId] = useState("qwen3-32b");
  const [gpuId, setGpuId] = useState("h100-sxm");
  const [dtype, setDtype] = useState<Dtype>("fp8");
  const model = MODELS[modelId];
  const gpu = GPUS[gpuId];
  return { modelId, setModelId, gpuId, setGpuId, dtype, setDtype, model, gpu };
}

export function KvCacheCalc({ meta }: { meta: CalculatorMeta }) {
  const { modelId, setModelId, gpuId, setGpuId, dtype, setDtype, model, gpu } = useModelGpu();
  const [context, setContext] = useState(2048);
  const [batch, setBatch] = useState(32);
  const [gpus, setGpus] = useState(1);

  const kvGb = model ? kvCacheGb(batch, context, model.num_layers, model.hidden_size) : 0;
  const perTok = model ? kvPerTokenBytes(model.num_layers, model.hidden_size) : 0;

  return (
    <CalculatorShell meta={meta}>
      <CalcForm>
        <CalcSelect label="Model" value={modelId} onChange={setModelId} options={modelOptions()} />
        <CalcSelect label="GPU" value={gpuId} onChange={setGpuId} options={gpuOptions()} />
        <CalcSelect label="Precision" value={dtype} onChange={(v) => setDtype(v as Dtype)} options={dtypeOptions} />
        <CalcNumber label="Context length" value={context} onChange={setContext} />
        <CalcNumber label="Batch size" value={batch} onChange={setBatch} />
        <CalcNumber label="GPUs (replica)" value={gpus} onChange={setGpus} />
      </CalcForm>
      <CalcResults
        rows={[
          { label: "KV bytes / token", value: `${perTok.toFixed(0)} B` },
          { label: "KV cache total", value: `${kvGb.toFixed(2)} GB` },
          { label: "Per GPU (even split)", value: `${(kvGb / gpus).toFixed(2)} GB` },
          { label: "GPU capacity", value: gpu ? `${gpu.memory_gb} GB` : "—" },
        ]}
      />
    </CalculatorShell>
  );
}

export function GpuMemoryCalc({ meta }: { meta: CalculatorMeta }) {
  const { modelId, setModelId, gpuId, setGpuId, dtype, setDtype, model, gpu } = useModelGpu();
  const [context, setContext] = useState(2048);
  const [batch, setBatch] = useState(32);
  const [tp, setTp] = useState(1);
  const [loraGb, setLoraGb] = useState(0);

  const w = model ? weightsGb(model.total_params_b, dtype) / tp : 0;
  const kv = model ? kvCacheGb(batch, context, model.num_layers, model.hidden_size) : 0;
  const act = model ? (batch * context * model.hidden_size * 4) / 1e9 : 0; // rough activation estimate
  const total = (w + kv + act + loraGb) * 1.15;
  const needed = gpu ? gpusNeededForMemory(total, gpu.memory_gb) : 1;

  return (
    <CalculatorShell meta={meta}>
      <CalcForm>
        <CalcSelect label="Model" value={modelId} onChange={setModelId} options={modelOptions()} />
        <CalcSelect label="GPU" value={gpuId} onChange={setGpuId} options={gpuOptions()} />
        <CalcSelect label="Precision" value={dtype} onChange={(v) => setDtype(v as Dtype)} options={dtypeOptions} />
        <CalcNumber label="Context length" value={context} onChange={setContext} />
        <CalcNumber label="Batch size" value={batch} onChange={setBatch} />
        <CalcNumber label="Tensor parallel" value={tp} onChange={setTp} />
        <CalcNumber label="LoRA adapters (GB)" value={loraGb} onChange={setLoraGb} min={0} />
      </CalcForm>
      <CalcResults
        rows={[
          { label: "Weights", value: `${w.toFixed(1)} GB` },
          { label: "KV cache", value: `${kv.toFixed(2)} GB` },
          { label: "Activations (est.)", value: `${act.toFixed(2)} GB` },
          { label: "Total (+15% overhead)", value: `${total.toFixed(1)} GB` },
          { label: "GPUs needed", value: `${needed}` },
        ]}
      />
    </CalculatorShell>
  );
}

export function GpuCountCalc({ meta }: { meta: CalculatorMeta }) {
  const { modelId, setModelId, gpuId, setGpuId, dtype, setDtype } = useModelGpu();
  const [qps, setQps] = useState(1000);
  const [prompt, setPrompt] = useState(2048);
  const [output, setOutput] = useState(40);
  const [batch, setBatch] = useState(32);

  const tps = estimateAggregateTps(modelId, gpuId, dtype, batch);
  const required = qps * output;
  const replicas = tps > 0 ? Math.max(1, Math.ceil(required / tps)) : 0;
  const model = MODELS[modelId];
  const w = model ? weightsGb(model.total_params_b, dtype) : 0;
  const kv = model ? kvCacheGb(batch, prompt + output, model.num_layers, model.hidden_size) : 0;
  const gpu = GPUS[gpuId];
  const perReplica = gpu ? gpusNeededForMemory(w + kv, gpu.memory_gb) : 1;
  const totalGpus = replicas * perReplica;
  const util = tps > 0 ? Math.min(100, (required / (replicas * tps)) * 100) : 0;
  const eco = gpu
    ? computeEcoMetrics({
        gpu,
        gpuCount: totalGpus,
        utilPct: util,
        outputTokensPerDay: qps * output * 86400,
      })
    : null;

  return (
    <CalculatorShell meta={meta}>
      <CalcForm>
        <CalcSelect label="Model" value={modelId} onChange={setModelId} options={modelOptions()} />
        <CalcSelect label="GPU" value={gpuId} onChange={setGpuId} options={gpuOptions()} />
        <CalcSelect label="Precision" value={dtype} onChange={(v) => setDtype(v as Dtype)} options={dtypeOptions} />
        <CalcNumber label="Peak QPS" value={qps} onChange={setQps} />
        <CalcNumber label="Prompt tokens" value={prompt} onChange={setPrompt} />
        <CalcNumber label="Output tokens" value={output} onChange={setOutput} />
        <CalcNumber label="Batch / replica" value={batch} onChange={setBatch} />
      </CalcForm>
      <CalcResults
        rows={[
          { label: "Required aggregate t/s", value: required.toLocaleString() },
          { label: "Per-replica throughput", value: `${Math.round(tps).toLocaleString()} t/s` },
          { label: "Replicas", value: `${replicas}` },
          { label: "GPUs / replica", value: `${perReplica}` },
          { label: "Total GPUs", value: `${totalGpus}` },
          { label: "Est. utilization", value: `${util.toFixed(0)}%` },
          ...(eco
            ? [
                { label: "power", value: `${eco.power} kW` },
                { label: "co2", value: `${eco.co2} kg CO₂/day` },
                { label: "carbon", value: `${eco.carbon} kg / 1M tokens` },
              ]
            : []),
        ]}
      />
    </CalculatorShell>
  );
}

export function CostCalc({ meta }: { meta: CalculatorMeta }) {
  const [gpuId, setGpuId] = useState("h100-sxm");
  const [count, setCount] = useState(64);
  const [hours, setHours] = useState(24);
  const [util, setUtil] = useState(70);
  const [outputTps, setOutputTps] = useState(500_000);

  const cost = monthlyGpuCost(gpuId, count, hours);
  const gpu = GPUS[gpuId];
  const eco = gpu
    ? computeEcoMetrics({
        gpu,
        gpuCount: count,
        utilPct: util,
        outputTokensPerDay: outputTps * 86400,
        hoursPerDay: hours,
      })
    : null;

  return (
    <CalculatorShell meta={meta}>
      <CalcForm>
        <CalcSelect label="GPU" value={gpuId} onChange={setGpuId} options={gpuOptions()} />
        <CalcNumber label="GPU count" value={count} onChange={setCount} />
        <CalcNumber label="Hours / day" value={hours} onChange={setHours} min={1} />
        <CalcNumber label="Utilization %" value={util} onChange={setUtil} min={1} />
        <CalcNumber label="Output t/s (fleet)" value={outputTps} onChange={setOutputTps} min={1} />
      </CalcForm>
      <CalcResults
        rows={[
          { label: "Daily", value: `$${cost.daily.toLocaleString()}` },
          { label: "Monthly", value: `$${cost.monthly.toLocaleString()}` },
          { label: "Annual", value: `$${cost.annual.toLocaleString()}` },
          { label: "Rate", value: `$${GPUS[gpuId]?.hourly_usd}/GPU-hr` },
          ...(eco
            ? [
                { label: "power", value: `${eco.power} kW` },
                { label: "energy", value: `${eco.energy} kWh/day` },
                { label: "co2", value: `${eco.co2} kg CO₂/day` },
              ]
            : []),
        ]}
      />
    </CalculatorShell>
  );
}

export function TpsCalc({ meta }: { meta: CalculatorMeta }) {
  const { modelId, setModelId, gpuId, setGpuId, dtype, setDtype } = useModelGpu();
  const [batch, setBatch] = useState(32);

  const tps = estimateAggregateTps(modelId, gpuId, dtype, batch);
  const perReq = batch > 0 ? tps / batch : 0;

  return (
    <CalculatorShell meta={meta}>
      <CalcForm>
        <CalcSelect label="Model" value={modelId} onChange={setModelId} options={modelOptions()} />
        <CalcSelect label="GPU" value={gpuId} onChange={setGpuId} options={gpuOptions()} />
        <CalcSelect label="Precision" value={dtype} onChange={(v) => setDtype(v as Dtype)} options={dtypeOptions} />
        <CalcNumber label="Batch size" value={batch} onChange={setBatch} />
      </CalcForm>
      <CalcResults
        rows={[
          { label: "Aggregate throughput", value: `${Math.round(tps).toLocaleString()} t/s` },
          { label: "Per-request decode", value: `${perReq.toFixed(1)} t/s` },
          { label: "ms / token (batch)", value: `${((batch / Math.max(tps, 1e-9)) * 1e3).toFixed(2)} ms` },
        ]}
      />
    </CalculatorShell>
  );
}

export function ContextMemoryCalc({ meta }: { meta: CalculatorMeta }) {
  const { modelId, setModelId, dtype, setDtype, model } = useModelGpu();
  const [batch, setBatch] = useState(32);
  const [ctxA, setCtxA] = useState(8192);
  const [ctxB, setCtxB] = useState(131072);

  const kvA = model ? kvCacheGb(batch, ctxA, model.num_layers, model.hidden_size) : 0;
  const kvB = model ? kvCacheGb(batch, ctxB, model.num_layers, model.hidden_size) : 0;

  return (
    <CalculatorShell meta={meta}>
      <CalcForm>
        <CalcSelect label="Model" value={modelId} onChange={setModelId} options={modelOptions()} />
        <CalcSelect label="Precision" value={dtype} onChange={(v) => setDtype(v as Dtype)} options={dtypeOptions} />
        <CalcNumber label="Batch size" value={batch} onChange={setBatch} />
        <CalcNumber label="Context A" value={ctxA} onChange={setCtxA} />
        <CalcNumber label="Context B" value={ctxB} onChange={setCtxB} />
      </CalcForm>
      <CalcResults
        rows={[
          { label: `KV @ ${ctxA.toLocaleString()}`, value: `${kvA.toFixed(2)} GB` },
          { label: `KV @ ${ctxB.toLocaleString()}`, value: `${kvB.toFixed(2)} GB` },
          { label: "Additional memory", value: `${(kvB - kvA).toFixed(2)} GB` },
          { label: "Multiplier", value: `${(kvB / Math.max(kvA, 1e-9)).toFixed(1)}×` },
        ]}
      />
    </CalculatorShell>
  );
}

export function MoeExpertCalc({ meta }: { meta: CalculatorMeta }) {
  const [modelId, setModelId] = useState("qwen3-235b-moe");
  const model = MODELS[modelId];

  const activeGb = model ? weightsGb(model.active_params_b, "fp8") : 0;
  const totalGb = model ? weightsGb(model.total_params_b, "fp8") : 0;
  const routingBytes = model
    ? 2 * model.top_k * model.hidden_size * DTYPE_BYTES.fp8
    : 0;

  return (
    <CalculatorShell meta={meta}>
      <CalcForm>
        <CalcSelect
          label="Model"
          value={modelId}
          onChange={setModelId}
          options={modelOptions().filter((m) => MODELS[m.id]?.is_moe)}
        />
      </CalcForm>
      <CalcResults
        rows={[
          { label: "Total parameters", value: model ? `${model.total_params_b}B` : "—" },
          { label: "Active / token", value: model ? `${model.active_params_b}B` : "—" },
          { label: "Experts / token (top-k)", value: model ? `${model.top_k}` : "—" },
          { label: "Total weight memory", value: `${totalGb.toFixed(1)} GB` },
          { label: "Active weight memory", value: `${activeGb.toFixed(1)} GB` },
          { label: "Routing bytes / token", value: `${routingBytes.toFixed(0)} B` },
        ]}
      />
    </CalculatorShell>
  );
}

export function TensorParallelCalc({ meta }: { meta: CalculatorMeta }) {
  const { modelId, setModelId, gpuId, setGpuId, dtype, setDtype, model, gpu } = useModelGpu();
  const [gpus, setGpus] = useState(8);

  const w = model ? weightsGb(model.total_params_b, dtype) : 0;
  const tp = gpu ? Math.max(1, Math.ceil(w / gpu.memory_gb)) : 1;
  const pp = Math.max(1, Math.floor(gpus / tp));
  const ep = model?.is_moe ? Math.max(1, Math.floor(gpus / tp)) : 1;

  return (
    <CalculatorShell meta={meta}>
      <CalcForm>
        <CalcSelect label="Model" value={modelId} onChange={setModelId} options={modelOptions()} />
        <CalcSelect label="GPU" value={gpuId} onChange={setGpuId} options={gpuOptions()} />
        <CalcSelect label="Precision" value={dtype} onChange={(v) => setDtype(v as Dtype)} options={dtypeOptions} />
        <CalcNumber label="GPUs available" value={gpus} onChange={setGpus} />
      </CalcForm>
      <CalcResults
        rows={[
          { label: "Weight memory", value: `${w.toFixed(1)} GB` },
          { label: "Suggested TP", value: `${tp}` },
          { label: "Suggested PP", value: `${pp}` },
          { label: "Suggested EP (MoE)", value: model?.is_moe ? `${ep}` : "N/A (dense)" },
        ]}
      />
    </CalculatorShell>
  );
}

export function NcclBandwidthCalc({ meta }: { meta: CalculatorMeta }) {
  const { modelId, setModelId } = useModelGpu();
  const [gpus, setGpus] = useState(8);
  const [fabricGbs, setFabricGbs] = useState(900);
  const [dtype, setDtype] = useState<Dtype>("fp8");
  const model = MODELS[modelId];

  const bytesPerToken = model
    ? 2 * model.num_layers * model.hidden_size * DTYPE_BYTES[dtype]
    : 0;
  const tNetMs = (bytesPerToken / (fabricGbs * 1e9)) * 1e3;

  return (
    <CalculatorShell meta={meta}>
      <CalcForm>
        <CalcSelect label="Model" value={modelId} onChange={setModelId} options={modelOptions()} />
        <CalcSelect label="Precision" value={dtype} onChange={(v) => setDtype(v as Dtype)} options={dtypeOptions} />
        <CalcNumber label="GPUs / replica" value={gpus} onChange={setGpus} />
        <CalcNumber label="Fabric GB/s per GPU" value={fabricGbs} onChange={setFabricGbs} />
      </CalcForm>
      <CalcResults
        rows={[
          { label: "All-reduce bytes / token", value: `${(bytesPerToken / 1e6).toFixed(2)} MB` },
          { label: "Comm time / token", value: `${tNetMs.toFixed(3)} ms` },
          { label: "Topology", value: fabricGbs >= 400 ? "NVLink domain" : "Inter-node IB" },
        ]}
      />
    </CalculatorShell>
  );
}

export function NetworkBottleneckCalc({ meta }: { meta: CalculatorMeta }) {
  const { modelId, setModelId, gpuId, setGpuId, dtype, setDtype } = useModelGpu();
  const [gpus, setGpus] = useState(16);
  const [batch, setBatch] = useState(32);

  const model = MODELS[modelId];
  const tps = estimateAggregateTps(modelId, gpuId, dtype, batch);
  const tOnchipMs = batch > 0 ? (batch / Math.max(tps, 1e-9)) * 1e3 / batch : 0;

  const bytesPerToken = model?.is_moe
    ? 2 * model.top_k * model.hidden_size * DTYPE_BYTES[dtype]
    : 2 * (model?.num_layers ?? 0) * (model?.hidden_size ?? 0) * DTYPE_BYTES[dtype];
  const fabricGbs = gpus > 8 ? 50 : 900;
  const tNetMs = (bytesPerToken / (fabricGbs * 1e9)) * 1e3;
  const networkBound = tNetMs > tOnchipMs && gpus > 1;

  return (
    <CalculatorShell meta={meta}>
      <CalcForm>
        <CalcSelect label="Model" value={modelId} onChange={setModelId} options={modelOptions()} />
        <CalcSelect label="GPU" value={gpuId} onChange={setGpuId} options={gpuOptions()} />
        <CalcSelect label="Precision" value={dtype} onChange={(v) => setDtype(v as Dtype)} options={dtypeOptions} />
        <CalcNumber label="GPUs / replica" value={gpus} onChange={setGpus} />
        <CalcNumber label="Batch" value={batch} onChange={setBatch} />
      </CalcForm>
      <CalcResults
        rows={[
          { label: "On-chip time / token", value: `${tOnchipMs.toFixed(3)} ms` },
          { label: "Network time / token", value: `${tNetMs.toFixed(3)} ms` },
          { label: "Binding regime", value: networkBound ? "Network-bound" : "On-chip bound" },
          { label: "Fabric (assumed)", value: `${fabricGbs} GB/s` },
        ]}
      />
    </CalculatorShell>
  );
}

export function TtftCalc({ meta }: { meta: CalculatorMeta }) {
  const { modelId, setModelId, gpuId, setGpuId, dtype, setDtype } = useModelGpu();
  const [context, setContext] = useState(4096);
  const [batch, setBatch] = useState(1);

  const ttft = estimateTtftMs(modelId, gpuId, dtype, context);
  const batched = ttft * (1 + 0.05 * (batch - 1)); // rough batch contention

  return (
    <CalculatorShell meta={meta}>
      <CalcForm>
        <CalcSelect label="Model" value={modelId} onChange={setModelId} options={modelOptions()} />
        <CalcSelect label="GPU" value={gpuId} onChange={setGpuId} options={gpuOptions()} />
        <CalcSelect label="Precision" value={dtype} onChange={(v) => setDtype(v as Dtype)} options={dtypeOptions} />
        <CalcNumber label="Prompt tokens" value={context} onChange={setContext} />
        <CalcNumber label="Batch size" value={batch} onChange={setBatch} />
      </CalcForm>
      <CalcResults
        rows={[
          { label: "TTFT (single)", value: `${ttft.toFixed(0)} ms` },
          { label: "TTFT (batched est.)", value: `${batched.toFixed(0)} ms` },
        ]}
      />
    </CalculatorShell>
  );
}

export function ContinuousBatchingCalc({ meta }: { meta: CalculatorMeta }) {
  const { modelId, setModelId, gpuId, setGpuId, dtype, setDtype } = useModelGpu();
  const batches = [1, 4, 16, 32, 64, 128];

  const rows = useMemo(
    () =>
      batches.map((b) => {
        const tps = estimateAggregateTps(modelId, gpuId, dtype, b);
        const lat = (b / Math.max(tps, 1e-9)) * 1e3;
        return { batch: b, tps: Math.round(tps), latency: lat.toFixed(0) };
      }),
    [modelId, gpuId, dtype],
  );

  return (
    <CalculatorShell meta={meta}>
      <CalcForm>
        <CalcSelect label="Model" value={modelId} onChange={setModelId} options={modelOptions()} />
        <CalcSelect label="GPU" value={gpuId} onChange={setGpuId} options={gpuOptions()} />
        <CalcSelect label="Precision" value={dtype} onChange={(v) => setDtype(v as Dtype)} options={dtypeOptions} />
      </CalcForm>
      <div className="rounded-lg border border-line bg-white p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">Batch sweep</p>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="text-xs uppercase text-muted">
              <th className="py-2 text-left">Batch</th>
              <th className="py-2 text-right">t/s</th>
              <th className="py-2 text-right">Step latency (ms)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.batch} className="border-t border-line">
                <td className="py-2">{r.batch}</td>
                <td className="py-2 text-right tabular-nums">{r.tps.toLocaleString()}</td>
                <td className="py-2 text-right tabular-nums">{r.latency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CalculatorShell>
  );
}

export function QuantizationCalc({ meta }: { meta: CalculatorMeta }) {
  const [modelId, setModelId] = useState("llama-3.3-70b");
  const [batch, setBatch] = useState(32);
  const model = MODELS[modelId];

  const rows = dtypeOptions.map((d) => {
    const mem = model ? weightsGb(model.total_params_b, d.id) : 0;
    const tps = estimateAggregateTps(modelId, "h100-sxm", d.id, batch);
    return { dtype: d.label, mem: mem.toFixed(1), tps: Math.round(tps) };
  });

  return (
    <CalculatorShell meta={meta}>
      <CalcForm>
        <CalcSelect label="Model" value={modelId} onChange={setModelId} options={modelOptions()} />
        <CalcNumber label="Batch size" value={batch} onChange={setBatch} />
      </CalcForm>
      <div className="rounded-lg border border-line bg-white p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">Precision comparison (H100)</p>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="text-xs uppercase text-muted">
              <th className="py-2 text-left">Precision</th>
              <th className="py-2 text-right">Weight GB</th>
              <th className="py-2 text-right">Est. t/s</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.dtype} className="border-t border-line">
                <td className="py-2">{r.dtype}</td>
                <td className="py-2 text-right tabular-nums">{r.mem}</td>
                <td className="py-2 text-right tabular-nums">{r.tps.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CalculatorShell>
  );
}

export function EnergyCalc({ meta }: { meta: CalculatorMeta }) {
  const [gpuId, setGpuId] = useState("h100-sxm");
  const [count, setCount] = useState(64);
  const [util, setUtil] = useState(70);
  const [hours, setHours] = useState(24);
  const [kwhPrice, setKwhPrice] = useState(0.12);
  const [outputTps, setOutputTps] = useState(500_000);

  const gpu = GPUS[gpuId];
  const eco = gpu
    ? computeEcoMetrics({
        gpu,
        gpuCount: count,
        utilPct: util,
        outputTokensPerDay: outputTps * 86400,
        hoursPerDay: hours,
      })
    : null;
  const cost = eco ? eco.energy * kwhPrice : 0;

  return (
    <CalculatorShell meta={meta}>
      <CalcForm>
        <CalcSelect label="GPU" value={gpuId} onChange={setGpuId} options={gpuOptions()} />
        <CalcNumber label="GPU count" value={count} onChange={setCount} />
        <CalcNumber label="Utilization %" value={util} onChange={setUtil} min={1} />
        <CalcNumber label="Hours / day" value={hours} onChange={setHours} />
        <CalcNumber label="Output t/s (fleet)" value={outputTps} onChange={setOutputTps} min={1} />
        <CalcNumber label="$/kWh" value={kwhPrice} onChange={setKwhPrice} min={0} />
      </CalcForm>
      <CalcResults
        rows={
          eco
            ? [
                ...ecoMetricRows(eco, { rating: true }),
                { label: "Daily power cost", value: `$${cost.toFixed(0)}` },
              ]
            : []
        }
      />
    </CalculatorShell>
  );
}

export function EcoImpactCalc({ meta }: { meta: CalculatorMeta }) {
  const { modelId, setModelId, gpuId, setGpuId, dtype, setDtype } = useModelGpu();
  const [gpuCount, setGpuCount] = useState(32);
  const [util, setUtil] = useState(75);
  const [qps, setQps] = useState(500);
  const [outputTokens, setOutputTokens] = useState(128);

  const gpu = GPUS[gpuId];
  const eco = gpu
    ? computeEcoMetrics({
        gpu,
        gpuCount,
        utilPct: util,
        outputTokensPerDay: qps * outputTokens * 86400,
      })
    : null;
  const tps = estimateAggregateTps(modelId, gpuId, dtype, 32);

  return (
    <CalculatorShell meta={meta}>
      <CalcForm>
        <CalcSelect label="Model" value={modelId} onChange={setModelId} options={modelOptions()} />
        <CalcSelect label="GPU" value={gpuId} onChange={setGpuId} options={gpuOptions()} />
        <CalcSelect label="Precision" value={dtype} onChange={(v) => setDtype(v as Dtype)} options={dtypeOptions} />
        <CalcNumber label="GPU count" value={gpuCount} onChange={setGpuCount} />
        <CalcNumber label="Utilization %" value={util} onChange={setUtil} min={1} />
        <CalcNumber label="Peak QPS" value={qps} onChange={setQps} />
        <CalcNumber label="Output tokens / request" value={outputTokens} onChange={setOutputTokens} />
      </CalcForm>
      <CalcResults
        rows={
          eco
            ? [
                ...ecoMetricRows(eco, { rating: true }),
                { label: "Theoretical t/s", value: `${Math.round(tps).toLocaleString()}` },
              ]
            : []
        }
      />
    </CalculatorShell>
  );
}

export function CostPerUserCalc({ meta }: { meta: CalculatorMeta }) {
  const [gpuId, setGpuId] = useState("h100-sxm");
  const [gpus, setGpus] = useState(32);
  const [dau, setDau] = useState(1_000_000);
  const [prompts, setPrompts] = useState(5);
  const [tokens, setTokens] = useState(2000);

  const monthly = monthlyGpuCost(gpuId, gpus, 24).monthly;
  const monthlyTokens = dau * prompts * tokens * 30;
  const perUser = dau > 0 ? monthly / dau : 0;
  const perMillion = monthlyTokens > 0 ? (monthly / monthlyTokens) * 1e6 : 0;

  return (
    <CalculatorShell meta={meta}>
      <CalcForm>
        <CalcSelect label="GPU" value={gpuId} onChange={setGpuId} options={gpuOptions()} />
        <CalcNumber label="Total GPUs" value={gpus} onChange={setGpus} />
        <CalcNumber label="Daily active users" value={dau} onChange={setDau} />
        <CalcNumber label="Prompts / user / day" value={prompts} onChange={setPrompts} />
        <CalcNumber label="Tokens / prompt" value={tokens} onChange={setTokens} />
      </CalcForm>
      <CalcResults
        rows={[
          { label: "Monthly infra cost", value: `$${monthly.toLocaleString()}` },
          { label: "Cost / user / month", value: `$${perUser.toFixed(4)}` },
          { label: "Cost / 1M tokens", value: `$${perMillion.toFixed(2)}` },
        ]}
      />
    </CalculatorShell>
  );
}

export function ReadinessCalc({ meta }: { meta: CalculatorMeta }) {
  const [hasSlo, setHasSlo] = useState(true);
  const [hasBench, setHasBench] = useState(false);
  const [hasMonitor, setHasMonitor] = useState(true);
  const [multiGpu, setMultiGpu] = useState(true);

  const score =
    (hasSlo ? 25 : 0) + (hasBench ? 30 : 0) + (hasMonitor ? 25 : 0) + (multiGpu ? 20 : 10);

  return (
    <CalculatorShell meta={meta}>
      <CalcForm>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={hasSlo} onChange={(e) => setHasSlo(e.target.checked)} />
          Latency SLO defined
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={hasBench} onChange={(e) => setHasBench(e.target.checked)} />
          Live benchmark baseline
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={hasMonitor} onChange={(e) => setHasMonitor(e.target.checked)} />
          Production telemetry
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={multiGpu} onChange={(e) => setMultiGpu(e.target.checked)} />
          Multi-GPU topology documented
        </label>
      </CalcForm>
      <CalcResults
        rows={[
          { label: "Readiness score", value: `${score} / 100` },
          {
            label: "Assessment",
            value: score >= 75 ? "Production-ready" : score >= 50 ? "Gaps remain" : "High risk",
          },
        ]}
      />
    </CalculatorShell>
  );
}

export function BottleneckCalc({ meta }: { meta: CalculatorMeta }) {
  const { modelId, setModelId, gpuId, setGpuId, dtype, setDtype } = useModelGpu();
  const [batch, setBatch] = useState(8);
  const [gpus, setGpus] = useState(1);

  const model = MODELS[modelId];
  const gpu = GPUS[gpuId];
  const tps = estimateAggregateTps(modelId, gpuId, dtype, batch);
  const w = model ? weightsGb(model.total_params_b, dtype) : 0;
  const kv = model ? kvCacheGb(batch, 2048, model.num_layers, model.hidden_size) : 0;
  const memPct = gpu ? ((w + kv) / gpu.memory_gb) * 100 : 0;

  const tMem = model && gpu
    ? (model.active_params_b * 1e9 * DTYPE_BYTES[dtype]) / (gpu.mem_bw_tbs * 1e12 * MBU) / batch * 1e3
    : 0;
  const tCompute = model && gpu
    ? (2 * model.active_params_b * 1e9) / (peakFlops(gpuId, dtype) * MFU) * 1e3
    : 0;

  let binding = "Compute-bound";
  if (memPct > 90) binding = "HBM capacity-bound";
  else if (tMem >= tCompute) binding = "Memory-bandwidth bound";
  else if (gpus > 1 && model?.is_moe) binding = "Network-bound (MoE)";

  return (
    <CalculatorShell meta={meta}>
      <CalcForm>
        <CalcSelect label="Model" value={modelId} onChange={setModelId} options={modelOptions()} />
        <CalcSelect label="GPU" value={gpuId} onChange={setGpuId} options={gpuOptions()} />
        <CalcSelect label="Precision" value={dtype} onChange={(v) => setDtype(v as Dtype)} options={dtypeOptions} />
        <CalcNumber label="Batch" value={batch} onChange={setBatch} />
        <CalcNumber label="GPUs / replica" value={gpus} onChange={setGpus} />
      </CalcForm>
      <CalcResults
        rows={[
          { label: "Predicted bottleneck", value: binding },
          { label: "HBM utilization", value: `${memPct.toFixed(0)}%` },
          { label: "Decode throughput", value: `${Math.round(tps)} t/s` },
        ]}
      />
    </CalculatorShell>
  );
}

export function ParallelismAdvisorCalc({ meta }: { meta: CalculatorMeta }) {
  const { modelId, setModelId, gpuId, setGpuId, dtype, setDtype, model, gpu } = useModelGpu();
  const [gpus, setGpus] = useState(32);

  const w = model ? weightsGb(model.total_params_b, dtype) : 0;
  const tp = gpu ? Math.max(1, Math.ceil(w / (gpu.memory_gb * 0.85))) : 1;
  const ep = model?.is_moe ? Math.min(gpus, 16) : 1;
  const pp = Math.max(1, Math.floor(gpus / (tp * ep)));
  const dp = Math.max(1, Math.floor(gpus / (tp * pp * ep)));

  const advice = model?.is_moe
    ? `EP=${ep} for expert routing; keep replicas inside NVLink domains.`
    : `TP=${tp} for weight sharding; PP if layers exceed single-node memory.`;

  return (
    <CalculatorShell meta={meta}>
      <CalcForm>
        <CalcSelect label="Model" value={modelId} onChange={setModelId} options={modelOptions()} />
        <CalcSelect label="GPU" value={gpuId} onChange={setGpuId} options={gpuOptions()} />
        <CalcSelect label="Precision" value={dtype} onChange={(v) => setDtype(v as Dtype)} options={dtypeOptions} />
        <CalcNumber label="Total GPUs" value={gpus} onChange={setGpus} />
      </CalcForm>
      <CalcResults
        rows={[
          { label: "Tensor parallel (TP)", value: `${tp}` },
          { label: "Pipeline parallel (PP)", value: `${pp}` },
          { label: "Expert parallel (EP)", value: model?.is_moe ? `${ep}` : "1" },
          { label: "Data parallel (DP)", value: `${dp}` },
          { label: "Note", value: advice },
        ]}
      />
    </CalculatorShell>
  );
}

export function ArchitectureAdvisorCalc({ meta }: { meta: CalculatorMeta }) {
  const { modelId, setModelId } = useModelGpu();
  const [qps, setQps] = useState(500);
  const [context, setContext] = useState(4096);

  const model = MODELS[modelId];
  const w = model ? weightsGb(model.total_params_b, "fp8") : 0;

  let arch = "Single-GPU serving";
  if (w > 80) arch = "Tensor-parallel replica";
  if (model?.is_moe) arch = "Expert-parallel + hierarchical all-to-all";
  if (qps > 5000) arch += " + prefill/decode disaggregation";
  if (context > 32000) arch += " + chunked prefill";

  return (
    <CalculatorShell meta={meta}>
      <CalcForm>
        <CalcSelect label="Model" value={modelId} onChange={setModelId} options={modelOptions()} />
        <CalcNumber label="Peak QPS" value={qps} onChange={setQps} />
        <CalcNumber label="Context length" value={context} onChange={setContext} />
      </CalcForm>
      <CalcResults rows={[{ label: "Suggested architecture", value: arch }]} />
    </CalculatorShell>
  );
}

export function ModelRecommendationCalc({ meta }: { meta: CalculatorMeta }) {
  const [maxLatency, setMaxLatency] = useState(500);
  const [maxCost, setMaxCost] = useState(50000);
  const [minContext, setMinContext] = useState(8192);

  const fits = Object.values(MODELS)
    .filter((m) => {
      const ttft = estimateTtftMs(m.id, "h100-sxm", "fp8", minContext);
      const cost = monthlyGpuCost("h100-sxm", gpusNeededForMemory(weightsGb(m.total_params_b, "fp8"), 80), 24).monthly;
      return ttft <= maxLatency && cost <= maxCost;
    })
    .map((m) => m.name);

  return (
    <CalculatorShell meta={meta}>
      <CalcForm>
        <CalcNumber label="Max TTFT (ms)" value={maxLatency} onChange={setMaxLatency} />
        <CalcNumber label="Max monthly cost ($)" value={maxCost} onChange={setMaxCost} />
        <CalcNumber label="Min context" value={minContext} onChange={setMinContext} />
      </CalcForm>
      <CalcResults
        rows={[
          {
            label: "Matching models",
            value: fits.length ? fits.join(", ") : "None — relax constraints",
          },
        ]}
      />
    </CalculatorShell>
  );
}
