import { PhasePick } from "./TrackRow";

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
}: StationGroupProps) => {
  const seed = parseInt(station.replace(/\D/g, '')) || 0;
  const probs = probabilities || generateMockProbabilities(seed);
  const theo = theoreticals || generateMockTheoreticals(seed);

  const handleWaveformClick = (trackId: string) => (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const position = ((e.clientX - rect.left) / rect.width) * 100;
    onAddPick(trackId, position);
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
        {tracks.map((track, idx) => {
          const trackPicks = picks[track.id] || [];
          return (
            <div
              key={track.id}
              className={`relative overflow-hidden bg-muted/10 cursor-crosshair ${idx > 0 ? 'border-t border-track-divider/50' : ''}`}
              style={{ height: `${waveformHeight * 4}px` }}
              onClick={handleWaveformClick(track.id)}
            >
              {/* Channel label */}
              <div className="absolute left-1 top-0.5 font-mono-data text-[9px] text-muted-foreground/60 z-10">
                {track.channel.slice(-1)}
              </div>
              
              <svg
                width="100%"
                height="100%"
                viewBox={`0 0 1000 ${waveformHeight * 4}`}
                preserveAspectRatio="none"
                className="stroke-waveform"
              >
                <polyline
                  fill="none"
                  strokeWidth="1.5"
                  points={Array.from({ length: 1000 }, (_, i) => {
                    const y = (waveformHeight * 2) + Math.sin(i / 20 + idx * 2) * (waveformHeight * 1.4) + Math.random() * 2;
                    return `${i},${y}`;
                  }).join(" ")}
                />
              </svg>

              {/* Phase Pick Markers */}
              {trackPicks.map((pick) => (
                <div
                  key={pick.id}
                  className="absolute top-0 h-full pointer-events-none"
                  style={{ left: `${pick.position}%` }}
                >
                  <div
                    className="absolute top-0 h-full w-0.5 opacity-90"
                    style={{ backgroundColor: phaseColors[pick.type] }}
                  />
                  <div
                    className="absolute top-0.5 -translate-x-1/2 flex items-center rounded px-0.5 text-[8px] font-mono-data font-semibold shadow-sm"
                    style={{
                      backgroundColor: phaseColors[pick.type],
                      color: "hsl(var(--background))",
                    }}
                  >
                    {pick.type}
                  </div>
                </div>
              ))}
            </div>
          );
        })}

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
