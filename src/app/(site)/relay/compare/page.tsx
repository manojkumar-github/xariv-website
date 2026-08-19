import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { RelayCompareStudio } from "@/components/relay/RelayCompareStudio";

export const metadata: Metadata = {
  title: "Relay Compare",
  description: "Split-pane compare of Llama 3.2 1B F16 vs Q4_K_M decode speed.",
};

export default function RelayComparePublicPage() {
  return (
    <Section className="pt-12 md:pt-16">
      <RelayCompareStudio />
    </Section>
  );
}
