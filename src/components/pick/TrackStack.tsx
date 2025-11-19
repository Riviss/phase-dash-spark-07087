import TrackRow, { PhasePick } from "./TrackRow";

const mockTracks = Array.from({ length: 12 }, (_, i) => ({
  id: `track-${i}`,
  station: `STA${i.toString().padStart(3, "0")}`,
  network: ["PQ", "XL", "EO"][i % 3],
  channel: "HHZ",
}));

interface TrackStackProps {
  picks: Record<string, PhasePick[]>;
  onAddPick: (trackId: string, position: number) => void;
}

const TrackStack = ({ picks, onAddPick }: TrackStackProps) => {
  return (
    <div className="min-w-full">
      {mockTracks.map((track, index) => (
        <div key={track.id}>
          <TrackRow
            track={track}
            picks={picks[track.id]}
            onAddPick={onAddPick}
          />
          {index < mockTracks.length - 1 && (
            <div className="h-[1px] bg-track-divider" />
          )}
        </div>
      ))}
    </div>
  );
};

export default TrackStack;
