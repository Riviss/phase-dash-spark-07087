import { useWaveformData } from "@/hooks/useWaveformData";
import { FilterPreset } from "./FilterControl";
import { PhasePick } from "./TrackRow";

const phaseColors = {
  P: "hsl(var(--rail-p))",
  S: "hsl(var(--rail-s))",
};

interface WaveformTrackProps {
  track: {
    id: string;
    channel: string;
  };
  height: number;
  idx: number;
  activeFilter: FilterPreset | null;
  picks: PhasePick[];
  showLabel?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const WaveformTrack = ({
  track,
  height,
  idx,
  activeFilter,
  picks,
  showLabel = true,
  onClick,
}: WaveformTrackProps) => {
  const seed = parseInt(track.id.replace(/\D/g, '')) || 0;
  const waveformData = useWaveformData(seed + idx, activeFilter);

  return (
    <div
      className={`relative overflow-hidden bg-muted/10 cursor-crosshair ${idx > 0 ? 'border-t border-track-divider/50' : ''}`}
      style={{ height: `${height * 4}px` }}
      onClick={onClick}
    >
      {/* Channel label */}
      <div className="absolute left-1 top-0.5 font-mono-data text-[9px] text-muted-foreground/60 z-10">
        {track.channel.slice(-1)}
      </div>
      
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 1000 ${height * 4}`}
        preserveAspectRatio="none"
        className="stroke-waveform"
      >
        <polyline
          fill="none"
          strokeWidth="1.5"
          points={waveformData.map((v, i) => {
            const y = (height * 2) + v * (height * 1.4);
            return `${i},${y}`;
          }).join(" ")}
        />
      </svg>

      {/* Phase Pick Markers - aligned across all channels */}
      {picks.map((pick) => (
        <div
          key={pick.id}
          className="absolute top-0 h-full pointer-events-none"
          style={{ left: `${pick.position}%` }}
        >
          <div
            className="absolute top-0 h-full w-0.5 opacity-90"
            style={{ backgroundColor: phaseColors[pick.type] }}
          />
          {/* Only show label on first track */}
          {showLabel && idx === 0 && (
            <div
              className="absolute top-0.5 -translate-x-1/2 flex items-center rounded px-0.5 text-[8px] font-mono-data font-semibold shadow-sm"
              style={{
                backgroundColor: phaseColors[pick.type],
                color: "hsl(var(--background))",
              }}
            >
              {pick.type}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default WaveformTrack;
