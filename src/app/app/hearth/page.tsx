"use client";

import Link from "next/link";
import { HearthChat } from "@/components/hearth/HearthChat";

export default function AppHearthPage() {
  return (
    <div>
      <div className="mb-6">
        <p className="eyebrow">XARIV Hearth</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink md:text-3xl">
          Your private ChatGPT — on this Mac
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-soft">
          Open models via llama.cpp. No cloud. Later: fine-tune with Relay and host your own weights.
        </p>
      </div>
      <HearthChat />
    </div>
  );
}
