export function HeroCodePanel() {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-code-block-bg shadow-xl shadow-accent/10">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        <span className="ml-2 font-mono text-xs text-zinc-500">lens · workload sizing</span>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed text-zinc-300">
        <code>{`# define workload → get decision report
from xariv import LensClient

client = LensClient()
workload = client.workloads.define(
    model="llama-3.1-70b",
    traffic_rps=120,
    slo_p99_ms=500,
)

report = workload.analyze()
report.bottleneck       # memory_bandwidth
report.gpu_count        # 31 (not 48)
report.recommendations  # tp=2, fp8, batch=32

# benchmark with real traffic
pulse = client.pulse.run(
    workload.id,
    dataset="sharegpt-sample",
)
pulse.confirms(report)  # p99 480ms @ 31 GPUs`}</code>
      </pre>
    </div>
  );
}
