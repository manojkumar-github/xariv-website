interface LogoProps {
  size?: number;
  className?: string;
  showWordmark?: boolean;
  variant?: "default" | "light";
}

export function XarivMark({
  size = 28,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const gradId = "xariv-mark-grad";
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
      <defs>
        <linearGradient id={gradId} x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7C3AED" />
          <stop offset="1" stopColor="#5B4BF0" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="30" height="30" rx="8" fill={`url(#${gradId})`} />
      <path
        d="M9 9 L16 23 L23 9"
        stroke="white"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M11 16 H21"
        stroke="white"
        strokeWidth="2.25"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle cx="24" cy="8" r="2.5" fill="white" opacity="0.9" />
    </svg>
  );
}

export function Logo({
  size = 28,
  className = "",
  showWordmark = true,
  variant = "default",
}: LogoProps) {
  const wordmarkClass =
    variant === "light"
      ? "font-semibold tracking-tight text-footer-ink"
      : "font-semibold tracking-tight text-ink";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <XarivMark size={size} />
      {showWordmark && (
        <span className={`text-lg ${wordmarkClass}`}>XARIV</span>
      )}
    </span>
  );
}
