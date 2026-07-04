import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/Section";
import { calculators, getCalculator } from "@/data/calculators";
import { calculatorViews } from "@/tools/calculators/registry";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return calculators.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const calc = getCalculator(slug);
  if (!calc) return { title: "Calculator" };
  return { title: calc.name, description: calc.description };
}

export default async function CalculatorPage({ params }: Props) {
  const { slug } = await params;
  const meta = getCalculator(slug);
  const View = calculatorViews[slug];
  if (!meta || !View) notFound();

  return (
    <Section narrow className="pt-16">
      <View meta={meta} />
    </Section>
  );
}
