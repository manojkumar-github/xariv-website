"use client";

import Link from "next/link";
import { RelayCompareStudio } from "@/components/relay/RelayCompareStudio";

export default function AppRelayComparePage() {
  return (
    <div>
      <p className="mb-6 text-sm text-muted">
        Need real llama.cpp endpoints?{" "}
        <Link href="/app/relay" className="font-medium text-accent hover:underline">
          Deploy locally
        </Link>{" "}
        after models are cached.
      </p>
      <RelayCompareStudio />
    </div>
  );
}
