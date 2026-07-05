import type { EcoMetrics } from "@/tools/engine/eco";
import MetricCard from "@/tools/lens/components/MetricCard";
import { toolCard } from "@/components/tools/styles";

interface Props {
  eco: EcoMetrics;
  title?: string;
  showRating?: boolean;
}

export function EcoMetricsPanel({ eco, title = "Environmental impact", showRating = true }: Props) {
  return (
    <div className={toolCard}>
      <h3 className="font-display text-lg font-medium text-ink">{title}</h3>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard label="power" value={`${eco.power} kW`} sub="fleet average sustained" />
        <MetricCard
          label="power_streaming"
          value={`${eco.power_streaming} kW`}
          sub="active inference load"
        />
        <MetricCard label="energy" value={`${eco.energy} kWh`} sub="per day" />
        <MetricCard label="co2" value={`${eco.co2} kg`} sub="CO₂ emissions / day" />
        <MetricCard label="carbon" value={`${eco.carbon}`} sub="kg CO₂ / 1M tokens" />
        <MetricCard label="temperature" value={`${eco.temperature} °C`} sub="GPU junction (est.)" />
      </div>
      {showRating && (
        <p className="mt-4 text-sm text-muted">
          Eco impact rating:{" "}
          <span className="font-medium text-accent">{ratingLabel(eco.carbon)}</span>
          <span className="text-muted"> — based on carbon intensity per 1M output tokens.</span>
        </p>
      )}
    </div>
  );
}

function ratingLabel(carbon: number): string {
  if (carbon <= 0) return "—";
  if (carbon < 0.05) return "A+";
  if (carbon < 0.1) return "A";
  if (carbon < 0.2) return "B";
  if (carbon < 0.4) return "C";
  if (carbon < 0.8) return "D";
  return "F";
}
