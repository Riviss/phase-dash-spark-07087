import TrackRow, { PhasePick, ChannelFilter } from "./TrackRow";

const mockTracks = Array.from({ length: 12 }, (_, i) => {
  const channels = ["HHZ", "HHE", "HHN"];
  return {
    id: `track-${i}`,
    station: `STA${i.toString().padStart(3, "0")}`,
    network: ["PQ", "XL", "EO"][i % 3],
    channel: channels[i % 3],
  };
});

interface TrackStackProps {
  picks: Record<string, PhasePick[]>;
  onAddPick: (trackId: string, position: number) => void;
  channelFilter: ChannelFilter;
  showTheoreticals: boolean;
  threshold: number;
}

const TrackStack = ({ picks, onAddPick, channelFilter, showTheoreticals, threshold }: TrackStackProps) => {
  // Filter tracks based on channel selection
  const filteredTracks = mockTracks.filter((track) => {
    if (channelFilter === "All") return true;
    const ch = track.channel.slice(-1); // Get last char (Z, E, N)
    if (channelFilter === "EN") return ch === "E" || ch === "N";
    return ch === channelFilter;
  });

  return (
    <div className="min-w-full">
      {filteredTracks.map((track, index) => (
        <div key={track.id}>
          <TrackRow
            track={track}
            picks={picks[track.id]}
            onAddPick={onAddPick}
            showTheoreticals={showTheoreticals}
            threshold={threshold}
          />
          {index < filteredTracks.length - 1 && (
            <div className="h-[1px] bg-track-divider" />
          )}
        </div>
      ))}
    </div>
  );
};

export default TrackStack;
