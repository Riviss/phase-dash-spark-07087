import TrackRow from "./TrackRow";

const mockTracks = Array.from({ length: 12 }, (_, i) => ({
  id: `track-${i}`,
  station: `STA${i.toString().padStart(3, "0")}`,
  network: ["PQ", "XL", "EO"][i % 3],
  channel: "HHZ",
}));

const TrackStack = () => {
  return (
    <div className="min-w-full">
      {mockTracks.map((track, index) => (
        <div key={track.id}>
          <TrackRow track={track} />
          {index < mockTracks.length - 1 && (
            <div className="h-[1px] bg-track-divider" />
          )}
        </div>
      ))}
    </div>
  );
};

export default TrackStack;
