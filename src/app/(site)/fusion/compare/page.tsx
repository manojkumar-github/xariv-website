import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { FusionCompareStudio } from "@/components/fusion/FusionCompareStudio";

export const metadata: Metadata = {
  title: "Fusion Compare",
  description: "Side-by-side kernel launch replay — llama.cpp Metal fusion ON vs OFF.",
};

export default function FusionComparePublicPage() {
  return (
    <Section className="pt-12 md:pt-16">
      <FusionCompareStudio />
    </Section>
  );
}
