import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";
import CanvasWaveform from "./CanvasWaveform";
import { FilterSettings } from "@/hooks/useAudioFilter";
import useAudioFilter from "@/hooks/useAudioFilter";

// Generate mock waveform data
const generateWaveformData = (length: number = 200): number[] => {
  return Array.from({ length }, (_, i) => {
    return Math.sin(i / 5) * 0.5 + Math.sin(i / 2) * 0.3 + (Math.random() - 0.5) * 0.4;
  });
};

// Generate mock probability data for P and S phases
const generateProbabilityData = (seed: number): { P: number[]; S: number[] } => {
  const generateCurve = (peakPos: number, spread: number) => {
    return Array.from({ length: 100 }, (_, i) => {
      const dist = Math.abs(i - peakPos);
      const base = Math.exp(-(dist * dist) / (2 * spread * spread));
      const noise = Math.random() * 0.05;
      return Math.min(1, Math.max(0, base * 0.85 + noise));
    });
  };
  
  return {
    P: generateCurve(25 + (seed % 20), 8),
    S: generateCurve(60 + (seed % 15), 10),
  };
};

const mockStations = Array.from({ length: 50 }, (_, i) => ({
  id: `STA${i.toString().padStart(3, "0")}`,
  network: ["PQ", "XL", "EO"][i % 3],
  status: i % 7 === 0 ? "warning" : "ok",
  latency: Math.floor(Math.random() * 200) + 20,
  lastSample: new Date(Date.now() - Math.random() * 60000),
  waveformData: generateWaveformData(),
  probabilities: generateProbabilityData(i),
}));

interface StationGridProps {
  filterSettings: FilterSettings;
  threshold?: number;
}

const StationGrid = ({ filterSettings, threshold = 0.3 }: StationGridProps) => {
  const { applyBandpassFilter } = useAudioFilter(100);

  // Memoize filtered data for all stations
  const filteredStations = useMemo(() => {
    return mockStations.map((station) => ({
      ...station,
      displayData: applyBandpassFilter(station.waveformData, filterSettings),
    }));
  }, [filterSettings, applyBandpassFilter]);

  // Render probability gradient with threshold-based alpha
  const renderProbabilityGradient = (data: number[], color: string) => {
    // Create gradient stops based on probability values
    const stops = data.map((prob, i) => {
      const position = (i / (data.length - 1)) * 100;
      // Alpha is 0.1 when below threshold, scales up to 1 when probability is 1
      const alpha = prob < threshold ? 0.1 : 0.1 + (prob - threshold) / (1 - threshold) * 0.9;
      return { position, alpha };
    });

    // Build gradient string
    const gradientStops = stops
      .map(({ position, alpha }) => `${color.replace(')', ` / ${alpha})`).replace('hsl', 'hsla')} ${position}%`)
      .join(', ');

    return `linear-gradient(90deg, ${gradientStops})`;
  };

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {filteredStations.map((station) => (
        <Card
          key={station.id}
          className="cursor-pointer border-border bg-card transition-colors hover:border-primary/50"
        >
          <div className="p-3">
            {/* Header */}
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono-data text-sm font-semibold">
                  {station.network}.{station.id}
                </span>
                {station.status === "ok" ? (
                  <CheckCircle className="h-3 w-3 text-primary" />
                ) : (
                  <AlertCircle className="h-3 w-3 text-destructive" />
                )}
              </div>
              <span className="font-mono-data text-xs text-muted-foreground">
                {station.latency}ms
              </span>
            </div>

            {/* Canvas Waveform */}
            <div className="mb-2 h-12 overflow-hidden rounded bg-muted/30">
              <CanvasWaveform
                data={station.displayData}
                height={48}
                className="stroke-waveform"
              />
            </div>

            {/* P/S Probability Rails with threshold-based alpha */}
            <div className="flex flex-col gap-1">
              <div 
                className="h-2 w-full rounded"
                style={{ 
                  background: renderProbabilityGradient(station.probabilities.P, "hsl(var(--rail-p))"),
                }}
                title="P-wave probability"
              />
              <div 
                className="h-2 w-full rounded"
                style={{ 
                  background: renderProbabilityGradient(station.probabilities.S, "hsl(var(--rail-s))"),
                }}
                title="S-wave probability"
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StationGrid;
