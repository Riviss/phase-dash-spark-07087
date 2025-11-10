interface TrackRowProps {
  track: {
    id: string;
    station: string;
    network: string;
    channel: string;
  };
}

const TrackRow = ({ track }: TrackRowProps) => {
  return (
    <div className="flex h-24 items-stretch">
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
        <div className="h-14 overflow-hidden bg-muted/10">
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
