"use client";

import Link from "next/link";
import { FusionCompareStudio } from "@/components/fusion/FusionCompareStudio";

export default function AppFusionComparePage() {
  return (
    <div>
      <p className="mb-6 text-sm text-muted">
        Real bench on your Mac:{" "}
        <code className="rounded bg-code-bg px-1 text-xs">
          llama-bench -m ~/.xariv/relay/models/Llama-3.2-1B-Instruct-Q4_K_M.gguf -p 128 -n 64
        </code>{" "}
        vs{" "}
        <code className="rounded bg-code-bg px-1 text-xs">GGML_METAL_FUSION_DISABLE=1</code>.{" "}
        <Link href="/relay" className="font-medium text-accent hover:underline">
          Relay deploy
        </Link>
      </p>
      <FusionCompareStudio />
    </div>
  );
}
