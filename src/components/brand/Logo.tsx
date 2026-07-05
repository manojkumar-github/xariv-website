interface LogoProps {
  size?: number;
  className?: string;
  showWordmark?: boolean;
}

export function XarivMark({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect x="1" y="1" width="30" height="30" rx="6" className="fill-accent" />
      <path
        d="M9 9 L16 23 L23 9"
        className="stroke-canvas"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M11 16 H21"
        className="stroke-canvas"
        strokeWidth="2.25"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

export function Logo({ size = 28, className = "", showWordmark = true }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <XarivMark size={size} />
      {showWordmark && (
        <span className="font-display text-xl font-medium tracking-tight text-ink">XARIV</span>
      )}
    </span>
  );
}
