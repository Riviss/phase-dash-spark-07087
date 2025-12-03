import { PhasePick } from "./TrackRow";
import { FilterPreset } from "./FilterControl";
import { PhaseType } from "./PhasePicker";
import WaveformTrack from "./WaveformTrack";
import { snapToNearestPeak } from "@/hooks/useSnapToPeak";

interface Track {
  id: string;
  station: string;
  network: string;
  channel: string;
}

interface ProbabilityData {
  P: number[];
  S: number[];
}

interface TheoreticalArrival {
  P?: number;
  S?: number;
}

interface StationGroupProps {
  station: string;
  network: string;
  tracks: Track[];
  picks: Record<string, PhasePick[]>;
  probabilities?: ProbabilityData;
  theoreticals?: TheoreticalArrival;
  showTheoreticals: boolean;
  threshold: number;
  onAddPick: (trackId: string, position: number) => void;
  activeFilter?: FilterPreset | null;
  zoom?: number;
  snapToMaxProb?: boolean;
  selectedPhase?: PhaseType;
}

const phaseColors = {
  P: "hsl(var(--rail-p))",
  S: "hsl(var(--rail-s))",
};

// Generate mock probability data
const generateMockProbabilities = (seed: number): ProbabilityData => {
  const generateCurve = (peakPos: number, spread: number) => {
    return Array.from({ length: 100 }, (_, i) => {
      const dist = Math.abs(i - peakPos);
      const base = Math.exp(-(dist * dist) / (2 * spread * spread));
      const noise = Math.random() * 0.05;
      return Math.min(1, Math.max(0, base * 0.9 + noise));
    });
  };
  
  return {
    P: generateCurve(25 + (seed % 20), 8),
    S: generateCurve(55 + (seed % 15), 10),
  };
};

const generateMockTheoreticals = (seed: number): TheoreticalArrival => ({
  P: 23 + (seed % 10),
  S: 52 + (seed % 12),
});

const StationGroup = ({
  station,
  network,
  tracks,
  picks,
  probabilities,
  theoreticals,
  showTheoreticals,
  threshold,
  onAddPick,
  activeFilter = null,
  zoom = 100,
  snapToMaxProb = false,
  selectedPhase = "P",
}: StationGroupProps) => {
  const seed = parseInt(station.replace(/\D/g, '')) || 0;
  const probs = probabilities || generateMockProbabilities(seed);
  const theo = theoreticals || generateMockTheoreticals(seed);

  // Station key for picks - all tracks in station share picks
  const stationKey = `${network}.${station}`;
  const stationPicks = picks[stationKey] || [];
  
  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    let position = ((e.clientX - rect.left) / rect.width) * 100;
    
    // Snap to nearest peak if enabled
    if (snapToMaxProb) {
      const probData = selectedPhase === "P" ? probs.P : probs.S;
      const snapResult = snapToNearestPeak(position, probData, threshold);
      if (snapResult.snapped) {
        position = snapResult.position;
      }
    }
    
    onAddPick(stationKey, position);
  };

  const renderProbabilityCurve = (data: number[], color: string, phase: "P" | "S") => {
    const height = 24;
    const points = data.map((v, i) => {
      const x = (i / (data.length - 1)) * 1000;
      const y = height - (v * height);
      return `${x},${y}`;
    }).join(" ");

    return (
      <g key={phase}>
        {/* Full curve - muted */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="1"
          strokeOpacity="0.25"
          points={points}
        />
        
        {/* Above threshold - bright */}
        {data.map((v, i) => {
          if (v >= threshold && i < data.length - 1) {
            const x1 = (i / (data.length - 1)) * 1000;
            const x2 = ((i + 1) / (data.length - 1)) * 1000;
            const y1 = height - (v * height);
            const y2 = height - (data[i + 1] * height);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={color}
                strokeWidth="2"
                strokeOpacity="0.9"
              />
            );
          }
          return null;
        })}
        
        {/* Peak marker */}
        {(() => {
          const maxVal = Math.max(...data);
          const maxIdx = data.indexOf(maxVal);
          if (maxVal >= threshold) {
            const x = (maxIdx / (data.length - 1)) * 1000;
            return (
              <circle
                cx={x}
                cy={height - (maxVal * height)}
                r="3"
                fill={color}
                stroke="hsl(var(--background))"
                strokeWidth="1"
              />
            );
          }
          return null;
        })()}
      </g>
    );
  };

  const waveformHeight = tracks.length > 1 ? 10 : 14;

  return (
    <div className="flex items-stretch relative">
      {/* Station Label */}
      <div className="flex w-32 flex-col justify-center border-r border-track-divider bg-card px-3 py-2">
        <div className="font-mono-data text-xs font-semibold">
          {network}.{station}
        </div>
        <div className="font-mono-data text-[10px] text-muted-foreground">
          {tracks.map(t => t.channel.slice(-1)).join(" ")}
        </div>
      </div>

      {/* Waveform + Rails Area */}
      <div className="relative flex-1 flex flex-col">
        {/* Waveform Lanes - one per channel */}
        {tracks.map((track, idx) => (
          <WaveformTrack
            key={track.id}
            track={track}
            height={waveformHeight}
            idx={idx}
            activeFilter={activeFilter || null}
            picks={stationPicks}
            showLabel={true}
            onClick={handleWaveformClick}
          />
        ))}

        {/* Probability Rail - Shared for station */}
        <div className="relative h-6 border-t border-track-divider bg-muted/5">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1000 24"
            preserveAspectRatio="none"
          >
            {renderProbabilityCurve(probs.P, phaseColors.P, "P")}
            {renderProbabilityCurve(probs.S, phaseColors.S, "S")}
            
            <line
              x1="0"
              y1={24 - (threshold * 24)}
              x2="1000"
              y2={24 - (threshold * 24)}
              stroke="hsl(var(--muted-foreground))"
              strokeWidth="0.5"
              strokeDasharray="4,4"
              opacity="0.3"
            />
          </svg>
        </div>

        {/* Theoretical Arrivals Rail */}
        {showTheoreticals && (
          <div className="relative h-2 border-t border-track-divider bg-muted/5">
            {theo.P !== undefined && (
              <div
                className="absolute top-0 h-full w-1 bg-rail-p/70"
                style={{ left: `${theo.P}%` }}
                title={`Theoretical P: ${theo.P.toFixed(1)}%`}
              />
            )}
            {theo.S !== undefined && (
              <div
                className="absolute top-0 h-full w-1 bg-rail-s/70"
                style={{ left: `${theo.S}%` }}
                title={`Theoretical S: ${theo.S.toFixed(1)}%`}
              />
            )}
          </div>
        )}

        {/* Spectrogram Strip */}
        <div
          className="h-2 border-t border-track-divider"
          style={{
            background:
              "linear-gradient(90deg, hsl(210 20% 14%), hsl(45 60% 30%), hsl(210 20% 14%))",
          }}
        />
      </div>
    </div>
  );
};

export default StationGroup;
