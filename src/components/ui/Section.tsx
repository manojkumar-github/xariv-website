import { ReactNode } from "react";
import { Container } from "@/components/layout/Container";

interface SectionProps {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
  id?: string;
}

export function Section({ children, className = "", narrow, id }: SectionProps) {
  return (
    <section id={id} className={`py-20 md:py-28 ${className}`}>
      <Container narrow={narrow}>{children}</Container>
    </section>
  );
}
