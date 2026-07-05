import type { Metadata } from "next";
import PulseApp from "@/tools/pulse/PulseApp";

export const metadata: Metadata = {
  title: "XARIV Pulse",
  description: "Benchmark LLM inference and visualize latency and GPU telemetry.",
};

export default function PulsePage() {
  return <PulseApp />;
}
