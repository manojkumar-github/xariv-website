export function PlatformDiagram({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 720 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="XARIV platform control plane diagram"
    >
      {/* Background */}
      <rect width="720" height="420" rx="12" fill="var(--canvas)" stroke="var(--line)" />

      {/* Central platform */}
      <rect x="260" y="24" width="200" height="56" rx="8" fill="var(--accent)" />
      <text x="360" y="48" textAnchor="middle" fill="var(--canvas)" fontSize="11" fontFamily="system-ui" letterSpacing="0.1em">
        XARIV PLATFORM
      </text>
      <text x="360" y="66" textAnchor="middle" fill="var(--canvas)" fontSize="10" fontFamily="system-ui" opacity="0.85">
        Engineering Control Plane
      </text>

      {/* Capability nodes */}
      {[
        { x: 40, y: 120, label: "Planning", sub: "Lens · Oracle" },
        { x: 160, y: 120, label: "Benchmarking", sub: "Pulse" },
        { x: 280, y: 120, label: "Explainability", sub: "Atlas · Lens" },
        { x: 400, y: 120, label: "Optimization", sub: "Lens" },
        { x: 520, y: 120, label: "Forecasting", sub: "Forge" },
      ].map((n) => (
        <g key={n.label}>
          <rect x={n.x} y={n.y} width="120" height="64" rx="6" fill="var(--surface)" stroke="var(--line)" />
          <text x={n.x + 60} y={n.y + 26} textAnchor="middle" fill="var(--ink)" fontSize="11" fontWeight="500" fontFamily="system-ui">
            {n.label}
          </text>
          <text x={n.x + 60} y={n.y + 44} textAnchor="middle" fill="var(--muted)" fontSize="9" fontFamily="system-ui">
            {n.sub}
          </text>
          <path d={`M${n.x + 60} ${n.y} L360 80`} stroke="var(--line)" strokeWidth="1" strokeDasharray="4 3" />
        </g>
      ))}

      {/* Workflow funnel */}
      <text x="40" y="230" fill="var(--muted)" fontSize="10" fontFamily="system-ui" letterSpacing="0.08em">
        10-MINUTE WORKFLOW
      </text>
      {[
        { x: 40, y: 248, w: 100, label: "Define\nworkload" },
        { x: 155, y: 248, w: 100, label: "Benchmark" },
        { x: 270, y: 248, w: 100, label: "Unified\nreport" },
        { x: 385, y: 248, w: 100, label: "Explain &\noptimize" },
        { x: 500, y: 248, w: 100, label: "Export\ndecision" },
      ].map((s, i, arr) => (
        <g key={s.label}>
          <rect x={s.x} y={s.y} width={s.w} height="52" rx="6" fill="var(--surface)" stroke={i === arr.length - 1 ? "var(--accent)" : "var(--line)"} strokeWidth={i === arr.length - 1 ? 1.5 : 1} />
          {s.label.split("\n").map((line, li) => (
            <text key={line} x={s.x + s.w / 2} y={s.y + 22 + li * 14} textAnchor="middle" fill="var(--ink-soft)" fontSize="10" fontFamily="system-ui">
              {line}
            </text>
          ))}
          {i < arr.length - 1 && (
            <path d={`M${s.x + s.w + 4} ${s.y + 26} L${arr[i + 1].x - 4} ${s.y + 26}`} stroke="var(--accent)" strokeWidth="1.5" markerEnd="url(#wf-arrow)" />
          )}
        </g>
      ))}

      {/* Personas bar */}
      <rect x="40" y="330" width="640" height="68" rx="8" fill="var(--surface)" stroke="var(--line)" />
      <text x="56" y="352" fill="var(--muted)" fontSize="9" fontFamily="system-ui" letterSpacing="0.08em">
        CROSS-FUNCTIONAL TEAMS
      </text>
      {["PM", "ML Eng", "Platform", "SRE", "Finance", "Director"].map((p, i) => (
        <g key={p}>
          <circle cx={100 + i * 100} cy={378} r="14" fill="var(--code-bg)" stroke="var(--line)" />
          <text x={100 + i * 100} y={382} textAnchor="middle" fill="var(--ink-soft)" fontSize="8" fontFamily="system-ui">
            {p}
          </text>
          {i < 5 && (
            <path d={`M${114 + i * 100} 378 L${186 + i * 100} 378`} stroke="var(--line)" strokeWidth="1" markerEnd="url(#persona-arrow)" />
          )}
        </g>
      ))}

      <defs>
        <marker id="wf-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="var(--accent)" />
        </marker>
        <marker id="persona-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="var(--muted)" />
        </marker>
      </defs>
    </svg>
  );
}
