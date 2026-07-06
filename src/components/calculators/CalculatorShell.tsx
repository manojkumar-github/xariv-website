"use client";

import Link from "next/link";
import { ReactNode } from "react";
import type { CalculatorMeta } from "@/data/calculators";

const field =
  "w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";
const label = "block text-xs font-medium uppercase tracking-wide text-muted mb-1";

export function CalcField({
  label: lbl,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className={label}>{lbl}</label>
      {children}
    </div>
  );
}

export function CalcSelect({
  label: lbl,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { id: string; label: string }[];
}) {
  return (
    <CalcField label={lbl}>
      <select className={field} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </CalcField>
  );
}

export function CalcNumber({
  label: lbl,
  value,
  onChange,
  min = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
}) {
  return (
    <CalcField label={lbl}>
      <input
        type="number"
        min={min}
        className={field}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </CalcField>
  );
}

export function CalcResults({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-6">
      <p className="text-xs font-medium uppercase tracking-wider text-muted">Results</p>
      <dl className="mt-4 space-y-3">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between gap-4 text-sm">
            <dt className="text-ink-soft">{r.label}</dt>
            <dd className="font-medium tabular-nums text-ink">{r.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-xs text-muted">
        Optional step 0 — continue to{" "}
        <Link href="/lens" className="text-accent hover:underline">
          Define workload (Lens)
        </Link>{" "}
        for the full platform workflow.
      </p>
    </div>
  );
}

export function CalculatorShell({
  meta,
  children,
}: {
  meta: CalculatorMeta;
  children: ReactNode;
}) {
  return (
    <div>
      <Link href="/workflow" className="text-sm text-muted hover:text-ink">
        ← Workflow
      </Link>
      <p className="mt-6 text-xs font-medium uppercase tracking-wider text-muted">
        Optional · Step 0 · Quick check
      </p>
      <h1 className="mt-2 font-display text-3xl font-medium text-ink">{meta.name}</h1>
      <p className="mt-3 max-w-xl text-ink-soft">{meta.description}</p>
      {(meta.relatedStudy || meta.relatedProduct) && (
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          {meta.relatedStudy && (
            <Link
              href={`/architecture-studies/${meta.relatedStudy}`}
              className="text-accent hover:underline"
            >
              Related study →
            </Link>
          )}
          {meta.relatedProduct && (
            <Link href={meta.relatedProduct} className="text-accent hover:underline">
              Open in {meta.relatedProduct === "/lens" ? "Lens" : "Pulse"} →
            </Link>
          )}
        </div>
      )}
      <div className="mt-10 grid gap-8 lg:grid-cols-2">{children}</div>
    </div>
  );
}

export function CalcForm({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-4 rounded-lg border border-line bg-surface p-6">{children}</div>
  );
}
