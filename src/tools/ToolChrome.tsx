import Link from "next/link";
import { ReactNode } from "react";

interface ToolChromeProps {
  product: string;
  stages: string[];
  children: ReactNode;
}

export function ToolChrome({ product, stages, children }: ToolChromeProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-baseline gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-tool-brand text-sm font-bold text-white">
              ✕
            </span>
            <span className="font-sans text-xl font-bold text-tool-ink">XARIV</span>
            <span className="text-sm text-slate-500">{product}</span>
          </div>
          <nav className="hidden gap-1 text-xs text-slate-400 sm:flex">
            {stages.map((s, i) => (
              <span key={s} className="flex items-center gap-1">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">{s}</span>
                {i < stages.length - 1 && <span>→</span>}
              </span>
            ))}
          </nav>
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-800">
            ← Home
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
