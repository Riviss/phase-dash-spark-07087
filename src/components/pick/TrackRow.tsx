export interface PhasePick {
  type: "P" | "S";
  position: number; // percentage 0-100
  id: string;
}

export type ChannelFilter = "All" | "Z" | "E" | "N" | "EN";

interface ProbabilityData {
  P: number[]; // 0-1 values across the track
  S: number[];
}

interface TheoreticalArrival {
  P?: number; // position 0-100
  S?: number;
}

interface TrackRowProps {
  track: {
    id: string;
    station: string;
    network: string;
    channel: string;
  };
  picks?: PhasePick[];
  probabilities?: ProbabilityData;
  theoreticals?: TheoreticalArrival;
  showTheoreticals?: boolean;
  threshold?: number; // 0-1
  onAddPick?: (trackId: string, position: number) => void;
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

const TrackRow = ({ 
  track, 
  picks = [], 
  probabilities,
  theoreticals,
  showTheoreticals = true,
  threshold = 0.3,
  onAddPick 
}: TrackRowProps) => {
  // Use provided data or generate mock
  const probs = probabilities || generateMockProbabilities(parseInt(track.id.replace(/\D/g, '')) || 0);
  const theo = theoreticals || generateMockTheoreticals(parseInt(track.id.replace(/\D/g, '')) || 0);
  
  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onAddPick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const position = ((e.clientX - rect.left) / rect.width) * 100;
    onAddPick(track.id, position);
  };

  // Render probability curve as SVG path
  const renderProbabilityCurve = (data: number[], color: string, phase: "P" | "S") => {
    const height = 24;
    const points = data.map((v, i) => {
      const x = (i / (data.length - 1)) * 1000;
      const y = height - (v * height);
      return `${x},${y}`;
    }).join(" ");

    return (
      <g key={phase}>
        {/* Filled area for above threshold */}
        <defs>
          <linearGradient id={`grad-${phase}-${track.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </linearGradient>
          <clipPath id={`clip-${phase}-${track.id}`}>
            <rect x="0" y="0" width="1000" height={height * (1 - threshold)} />
          </clipPath>
        </defs>
        
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

  return (
    <div className="flex h-24 items-stretch relative">
      {/* Track Label */}
      <div className="flex w-32 flex-col justify-center border-r border-track-divider bg-card px-3">
        <div className="font-mono-data text-xs font-semibold">
          {track.network}.{track.station}
        </div>
        <div className="font-mono-data text-[10px] text-muted-foreground">
          {track.channel}
        </div>
      </div>

      {/* Waveform + Rails Area */}
      <div className="relative flex-1">
        {/* Waveform Lane */}
        <div
          className="h-14 overflow-hidden bg-muted/10 cursor-crosshair relative"
          onClick={handleWaveformClick}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1000 56"
            preserveAspectRatio="none"
            className="stroke-waveform"
          >
            <polyline
              fill="none"
              strokeWidth="1.5"
              points={Array.from({ length: 1000 }, (_, i) => {
                const y = 28 + Math.sin(i / 20) * 20 + Math.random() * 3;
                return `${i},${y}`;
              }).join(" ")}
            />
          </svg>

          {/* Phase Pick Markers */}
          {picks.map((pick) => (
            <div
              key={pick.id}
              className="absolute top-0 h-full pointer-events-none"
              style={{ left: `${pick.position}%` }}
            >
              {/* Vertical line */}
              <div
                className="absolute top-0 h-full w-0.5 opacity-90"
                style={{ backgroundColor: phaseColors[pick.type] }}
              />
              {/* Flag */}
              <div
                className="absolute top-1 -translate-x-1/2 flex items-center gap-0.5 rounded px-1 py-0.5 text-[10px] font-mono-data font-semibold shadow-sm"
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

        {/* Probability Rail - Combined P and S */}
        <div className="relative h-6 border-t border-track-divider bg-muted/5">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 1000 24"
            preserveAspectRatio="none"
          >
            {renderProbabilityCurve(probs.P, phaseColors.P, "P")}
            {renderProbabilityCurve(probs.S, phaseColors.S, "S")}
            
            {/* Threshold line */}
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

        {/* Theoretical Arrivals Rail - Single combined */}
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

export default TrackRow;
