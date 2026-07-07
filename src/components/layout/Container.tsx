import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
}

export function Container({ children, className = "", narrow }: ContainerProps) {
  const width = narrow ? "max-w-3xl" : "max-w-6xl";
  return (
    <div className={`mx-auto w-full px-6 lg:px-8 ${width} ${className}`}>{children}</div>
  );
}
