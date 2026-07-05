import type { Metadata } from "next";
import LensApp from "@/tools/lens/LensApp";

export const metadata: Metadata = {
  title: "XARIV Lens",
  description: "Predict infrastructure cost, performance, and bottlenecks before deployment.",
};

export default function LensPage() {
  return <LensApp />;
}
