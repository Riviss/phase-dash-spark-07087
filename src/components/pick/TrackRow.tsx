export interface PhasePick {
  type: "P" | "S";
  position: number; // percentage 0-100
  id: string;
}

interface TrackRowProps {
  track: {
    id: string;
    station: string;
    network: string;
    channel: string;
  };
  picks?: PhasePick[];
  onAddPick?: (trackId: string, position: number) => void;
}

const phaseColors = {
  P: "hsl(var(--rail-p))",
  S: "hsl(var(--rail-s))",
};

const TrackRow = ({ track, picks = [], onAddPick }: TrackRowProps) => {
  console.log(`TrackRow ${track.id} received picks:`, picks);
  
  const handleWaveformClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onAddPick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const position = ((e.clientX - rect.left) / rect.width) * 100;
    console.log("Waveform clicked:", { trackId: track.id, position });
    onAddPick(track.id, position);
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

        {/* P Rail */}
        <div className="relative h-3 border-t border-track-divider bg-muted/5">
          <div
            className="absolute h-full bg-rail-p/30"
            style={{
              left: `${Math.random() * 60 + 20}%`,
              width: `${Math.random() * 10 + 5}%`,
            }}
          />
          <div
            className="absolute top-0 h-full w-0.5 bg-rail-p"
            style={{ left: `${Math.random() * 60 + 20}%` }}
          />
        </div>

        {/* S Rail */}
        <div className="relative h-3 border-t border-track-divider bg-muted/5">
          <div
            className="absolute h-full bg-rail-s/30"
            style={{
              left: `${Math.random() * 60 + 30}%`,
              width: `${Math.random() * 10 + 5}%`,
            }}
          />
          <div
            className="absolute top-0 h-full w-0.5 bg-rail-s"
            style={{ left: `${Math.random() * 60 + 30}%` }}
          />
        </div>

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
