import { Container } from "@/components/layout/Container";

export default function Loading() {
  return (
    <Container className="py-24">
      <div className="h-8 w-48 animate-pulse rounded bg-line" />
      <div className="mt-6 h-4 w-full max-w-xl animate-pulse rounded bg-line" />
      <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-line" />
    </Container>
  );
}
