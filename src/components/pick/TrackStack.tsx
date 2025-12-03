import TrackRow, { PhasePick, ChannelFilter } from "./TrackRow";
import StationGroup from "./StationGroup";
import { FilterPreset } from "./FilterControl";
import { PhaseType } from "./PhasePicker";

const mockTracks = Array.from({ length: 12 }, (_, i) => {
  const stationIdx = Math.floor(i / 3);
  const channels = ["HHZ", "HHE", "HHN"];
  return {
    id: `track-${i}`,
    station: `STA${stationIdx.toString().padStart(3, "0")}`,
    network: ["PQ", "XL", "EO"][stationIdx % 3],
    channel: channels[i % 3],
  };
});

export interface TrackStackProps {
  picks: Record<string, PhasePick[]>;
  onAddPick: (trackId: string, position: number) => void;
  channelFilter: ChannelFilter;
  showTheoreticals: boolean;
  threshold: number;
  activeFilter: FilterPreset | null;
  zoom: number;
  snapToMaxProb?: boolean;
  selectedPhase?: PhaseType;
}

const TrackStack = ({ picks, onAddPick, channelFilter, showTheoreticals, threshold, activeFilter, zoom, snapToMaxProb = false, selectedPhase = "P" }: TrackStackProps) => {
  // Filter tracks based on channel selection
  const filteredTracks = mockTracks.filter((track) => {
    if (channelFilter === "All") return true;
    const ch = track.channel.slice(-1);
    if (channelFilter === "EN") return ch === "E" || ch === "N";
    return ch === channelFilter;
  });

  // Group by station when showing multiple channels
  const shouldGroup = channelFilter === "All" || channelFilter === "EN";
  
  if (shouldGroup) {
    // Group tracks by station
    const stationGroups = filteredTracks.reduce((acc, track) => {
      const key = `${track.network}.${track.station}`;
      if (!acc[key]) {
        acc[key] = {
          station: track.station,
          network: track.network,
          tracks: [],
        };
      }
      acc[key].tracks.push(track);
      return acc;
    }, {} as Record<string, { station: string; network: string; tracks: typeof filteredTracks }>);

    const groups = Object.values(stationGroups);

    return (
      <div style={{ width: `${zoom}%`, minWidth: '100%' }}>
        {groups.map((group, index) => (
          <div key={`${group.network}.${group.station}`}>
            <StationGroup
              station={group.station}
              network={group.network}
              tracks={group.tracks}
              picks={picks}
              showTheoreticals={showTheoreticals}
              threshold={threshold}
              onAddPick={onAddPick}
              activeFilter={activeFilter}
              zoom={zoom}
              snapToMaxProb={snapToMaxProb}
              selectedPhase={selectedPhase}
            />
            {index < groups.length - 1 && (
              <div className="h-[1px] bg-track-divider" />
            )}
          </div>
        ))}
      </div>
    );
  }

  // Single channel view - use individual TrackRow
  return (
    <div style={{ width: `${zoom}%`, minWidth: '100%' }}>
      {filteredTracks.map((track, index) => (
        <div key={track.id}>
          <TrackRow
            track={track}
            picks={picks[track.id]}
            onAddPick={onAddPick}
            showTheoreticals={showTheoreticals}
            threshold={threshold}
            activeFilter={activeFilter}
            zoom={zoom}
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
