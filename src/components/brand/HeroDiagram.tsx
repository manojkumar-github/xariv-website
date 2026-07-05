export function HeroDiagram({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="XARIV Lens and Pulse workflow diagram"
    >
      <rect width="640" height="400" rx="12" fill="#f7f5f2" stroke="#e8e4df" />
      {/* Input */}
      <rect x="32" y="48" width="140" height="88" rx="8" fill="#fff" stroke="#e8e4df" />
      <text x="52" y="78" fill="#7a746c" fontSize="11" fontFamily="system-ui" letterSpacing="0.08em">
        WORKLOAD
      </text>
      <text x="52" y="100" fill="#1c1c1c" fontSize="13" fontFamily="Georgia, serif">
        Model · GPU · QPS
      </text>
      <text x="52" y="118" fill="#4a4540" fontSize="11" fontFamily="system-ui">
        Context · Batch · SLO
      </text>
      {/* Lens */}
      <rect x="220" y="32" width="200" height="120" rx="8" fill="#fff" stroke="#1e3a5f" strokeWidth="1.5" />
      <rect x="236" y="48" width="24" height="24" rx="5" fill="#1e3a5f" />
      <path d="M242 54 L248 66 L254 54" stroke="#f7f5f2" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <text x="268" y="64" fill="#1c1c1c" fontSize="14" fontWeight="500" fontFamily="Georgia, serif">
        XARIV Lens
      </text>
      <text x="236" y="88" fill="#4a4540" fontSize="11" fontFamily="system-ui">
        GPU sizing · Cost · Bottleneck
      </text>
      <text x="236" y="106" fill="#4a4540" fontSize="11" fontFamily="system-ui">
        TTFT · Throughput · Recommendations
      </text>
      <text x="236" y="132" fill="#1e3a5f" fontSize="11" fontFamily="system-ui" fontWeight="500">
        31 GPUs · $142K/mo · Memory BW bound
      </text>
      {/* Pulse */}
      <rect x="220" y="200" width="200" height="120" rx="8" fill="#fff" stroke="#1e3a5f" strokeWidth="1.5" />
      <rect x="236" y="216" width="24" height="24" rx="5" fill="#1e3a5f" />
      <path d="M242 222 L248 234 L254 222" stroke="#f7f5f2" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <text x="268" y="232" fill="#1c1c1c" fontSize="14" fontWeight="500" fontFamily="Georgia, serif">
        XARIV Pulse
      </text>
      <text x="236" y="256" fill="#4a4540" fontSize="11" fontFamily="system-ui">
        Dataset replay · Latency percentiles
      </text>
      <text x="236" y="274" fill="#4a4540" fontSize="11" fontFamily="system-ui">
        TTFT · ITL · TPOT · GPU telemetry
      </text>
      <text x="236" y="300" fill="#1e3a5f" fontSize="11" fontFamily="system-ui" fontWeight="500">
        p99 412ms · 1,240 t/s · 78% SM util
      </text>
      {/* Dataset input */}
      <rect x="32" y="216" width="140" height="88" rx="8" fill="#fff" stroke="#e8e4df" />
      <text x="52" y="246" fill="#7a746c" fontSize="11" fontFamily="system-ui" letterSpacing="0.08em">
        DATASET
      </text>
      <text x="52" y="268" fill="#1c1c1c" fontSize="13" fontFamily="Georgia, serif">
        ShareGPT · Custom
      </text>
      <text x="52" y="286" fill="#4a4540" fontSize="11" fontFamily="system-ui">
        500 requests · 32 concurrent
      </text>
      {/* Output panels */}
      <rect x="468" y="48" width="140" height="72" rx="8" fill="#fff" stroke="#e8e4df" />
      <text x="488" y="78" fill="#7a746c" fontSize="10" fontFamily="system-ui">
        DECISION REPORT
      </text>
      <text x="488" y="98" fill="#1c1c1c" fontSize="12" fontFamily="system-ui">
        Provision · Optimize
      </text>
      <rect x="468" y="140" width="140" height="72" rx="8" fill="#fff" stroke="#e8e4df" />
      <text x="488" y="170" fill="#7a746c" fontSize="10" fontFamily="system-ui">
        UTILIZATION
      </text>
      <text x="488" y="190" fill="#1c1c1c" fontSize="12" fontFamily="system-ui">
        HBM · Compute · Network
      </text>
      <rect x="468" y="232" width="140" height="88" rx="8" fill="#fff" stroke="#e8e4df" />
      <text x="488" y="262" fill="#7a746c" fontSize="10" fontFamily="system-ui">
        LATENCY PROFILE
      </text>
      <text x="488" y="282" fill="#1c1c1c" fontSize="12" fontFamily="system-ui">
        p50 · p90 · p99 curves
      </text>
      <text x="488" y="300" fill="#4a4540" fontSize="10" fontFamily="system-ui">
        Power · Temp · HBM
      </text>
      {/* Arrows */}
      <path d="M172 92 H218" stroke="#1e3a5f" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <path d="M172 260 H218" stroke="#1e3a5f" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <path d="M420 92 H466" stroke="#7a746c" strokeWidth="1.5" markerEnd="url(#arrow-muted)" />
      <path d="M420 164 H466" stroke="#7a746c" strokeWidth="1.5" markerEnd="url(#arrow-muted)" />
      <path d="M420 260 H466" stroke="#7a746c" strokeWidth="1.5" markerEnd="url(#arrow-muted)" />
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="#1e3a5f" />
        </marker>
        <marker id="arrow-muted" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="#7a746c" />
        </marker>
      </defs>
      {/* Bottom bar */}
      <rect x="32" y="352" width="576" height="28" rx="6" fill="#edeae5" />
      <text x="48" y="371" fill="#4a4540" fontSize="11" fontFamily="system-ui">
        Predict before you provision · Profile before you serve · Plan with first-principles models
      </text>
    </svg>
  );
}
