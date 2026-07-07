import Link from "next/link";

const steps = [
  {
    num: "01",
    title: "Define the workload",
    description:
      "Model, traffic, SLOs, and hardware constraints — one structured definition in Lens.",
    code: 'workload = lens.define(model="llama-70b")',
    href: "/lens",
  },
  {
    num: "02",
    title: "Benchmark real traffic",
    description:
      "Replay production or sample datasets in Pulse. Collect TTFT, throughput, and GPU telemetry.",
    code: 'pulse.run(workload.id, dataset="sharegpt")',
    href: "/pulse",
  },
  {
    num: "03",
    title: "Analyze and decide",
    description:
      "Unified report with bottleneck explainability, ranked optimizations, and exportable decision.",
    code: "report.export(format='pdf')",
    href: "/workflow",
  },
] as const;

export function WorkflowStepCards() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {steps.map((s) => (
        <div
          key={s.num}
          className="flex flex-col rounded-xl border border-line bg-surface p-6 shadow-sm"
        >
          <span className="font-mono text-sm font-semibold text-accent">{s.num}</span>
          <h3 className="mt-4 text-lg font-semibold text-ink">{s.title}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
            {s.description}
          </p>
          <code className="mt-4 block rounded-lg bg-code-bg px-3 py-2 font-mono text-xs text-ink-soft">
            {s.code}
          </code>
          <Link
            href={s.href}
            className="mt-4 text-sm font-medium text-accent hover:underline"
          >
            Start →
          </Link>
        </div>
      ))}
    </div>
  );
}
