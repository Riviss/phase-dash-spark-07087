import { useState, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import TrackStack from "@/components/pick/TrackStack";
import PickInspector from "@/components/pick/PickInspector";
import EventsRail, { mockEvents } from "@/components/pick/EventsRail";
import PhasePicker, { PhaseType } from "@/components/pick/PhasePicker";
import FilterControl, { FilterPreset } from "@/components/pick/FilterControl";
import ChannelSelector from "@/components/pick/ChannelSelector";
import { PhasePick, ChannelFilter } from "@/components/pick/TrackRow";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

const Pick = () => {
  const [selectedPhase, setSelectedPhase] = useState<PhaseType>("P");
  const [picks, setPicks] = useState<Record<string, PhasePick[]>>({});
  const [onePickMode, setOnePickMode] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterPreset | null>(null);
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>("All");
  const [showTheoreticals, setShowTheoreticals] = useState(true);
  const [threshold, setThreshold] = useState(0.3);
  const [selectedEventId, setSelectedEventId] = useState(mockEvents[0]?.id || "");
  const [zoom, setZoom] = useState(100);

  const selectedEvent = mockEvents.find(e => e.id === selectedEventId);

  const handleAddPick = (stationId: string, position: number) => {
    const newPick: PhasePick = {
      type: selectedPhase,
      position,
      id: `${stationId}-${selectedPhase}-${Date.now()}`,
    };
    
    console.log("Adding pick:", { stationId, position, selectedPhase, newPick });
    
    setPicks((prev) => {
      // If one pick mode is enabled, clear ALL existing picks of the same type across all stations
      if (onePickMode) {
        const cleared: Record<string, PhasePick[]> = {};
        Object.entries(prev).forEach(([key, pickList]) => {
          cleared[key] = pickList.filter(pick => pick.type !== selectedPhase);
        });
        return {
          ...cleared,
          [stationId]: [...(cleared[stationId] || []), newPick],
        };
      }
      
      const existingPicks = prev[stationId] || [];
      return {
        ...prev,
        [stationId]: [...existingPicks, newPick],
      };
    });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Phase selection
      if (e.key === "1") {
        setSelectedPhase("P");
      } else if (e.key === "2") {
        setSelectedPhase("S");
      }
      // Channel selection
      else if (e.key.toLowerCase() === "a") {
        setChannelFilter("All");
      } else if (e.key.toLowerCase() === "z") {
        setChannelFilter("Z");
      } else if (e.key.toLowerCase() === "e") {
        setChannelFilter("E");
      } else if (e.key.toLowerCase() === "n") {
        setChannelFilter("N");
      } else if (e.key.toLowerCase() === "x") {
        setChannelFilter("EN");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div className="flex h-full flex-col">
      {/* Top Control Bar */}
      <div className="flex items-center gap-4 border-b border-border bg-card px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Area:</span>
          <span className="font-mono-data text-xs font-medium">WCSB</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Window:</span>
          <span className="font-mono-data text-xs">2024-01-15 14:23:00</span>
          <span className="text-xs text-muted-foreground">→</span>
          <span className="font-mono-data text-xs">2024-01-15 14:24:00</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Model:</span>
          <Badge variant="secondary" className="text-xs">
            EQTransformer v2.1
          </Badge>
        </div>

        <FilterControl onFilterChange={setActiveFilter} />

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">View:</span>
          <Button variant="outline" size="sm" className="h-6 text-xs">
            Live
          </Button>
          <Button variant="ghost" size="sm" className="h-6 text-xs">
            Pick-Pass
          </Button>
          <Button variant="ghost" size="sm" className="h-6 text-xs">
            QC
          </Button>
        </div>
      </div>

      {/* Event Info & Controls */}
      <div className="flex items-center gap-6 border-b border-border bg-card px-4 py-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Event:</span>
          <span className="font-mono-data font-medium">
            {selectedEvent ? new Date(selectedEvent.time).toLocaleString() : "No event selected"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">M</span>
          <Badge variant="secondary" className="font-mono-data text-xs">
            {selectedEvent?.magnitude.toFixed(1) || "-"}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Depth:</span>
          <span className="font-mono-data">{selectedEvent?.depth.toFixed(1) || "-"} km</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Location:</span>
          <span className="font-mono-data">{selectedEvent?.location || "-"}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Picks:</span>
          <span className="font-mono-data">{selectedEvent?.picks || "-"}</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <PhasePicker
            selectedPhase={selectedPhase}
            onPhaseSelect={setSelectedPhase}
          />

          <ChannelSelector
            selected={channelFilter}
            onSelect={setChannelFilter}
          />

          <label className="flex cursor-pointer items-center gap-1.5">
            <input 
              type="checkbox" 
              className="h-3 w-3 rounded" 
              checked={showTheoreticals}
              onChange={(e) => setShowTheoreticals(e.target.checked)}
            />
            <span className="text-muted-foreground">Theoretical</span>
          </label>

          <label className="flex cursor-pointer items-center gap-1.5">
            <input 
              type="checkbox" 
              className="h-3 w-3 rounded" 
              checked={onePickMode}
              onChange={(e) => setOnePickMode(e.target.checked)}
            />
            <span className="text-muted-foreground">One Pick Mode</span>
          </label>

          <Button variant="outline" size="sm" className="h-7 text-xs">
            Relocate
          </Button>
        </div>
      </div>

      {/* Main Editor Area */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Events Rail */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <EventsRail 
            selectedEventId={selectedEventId}
            onSelectEvent={setSelectedEventId}
          />
        </ResizablePanel>

        <ResizableHandle />

        {/* Track Stack */}
        <ResizablePanel defaultSize={60}>
          <div className="h-full overflow-auto">
            <TrackStack 
              picks={picks} 
              onAddPick={handleAddPick}
              channelFilter={channelFilter}
              showTheoreticals={showTheoreticals}
              threshold={threshold}
              activeFilter={activeFilter}
              zoom={zoom}
            />
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* Right Inspector */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <PickInspector />
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Transport Controls */}
      <div className="flex items-center gap-4 border-t border-border bg-transport px-4 py-3">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Play className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <SkipForward className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Repeat className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Shuttle:</span>
          <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono-data text-[10px]">
            J
          </kbd>
          <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono-data text-[10px]">
            K
          </kbd>
          <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono-data text-[10px]">
            L
          </kbd>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Snap:</span>
          <Button variant="outline" size="sm" className="h-6 text-xs">
            Max-Prob
          </Button>
        </div>

        <div className="flex flex-1 items-center gap-3">
          <span className="text-xs text-muted-foreground">Zoom:</span>
          <Slider
            value={[zoom]}
            onValueChange={(v) => setZoom(v[0])}
            min={50}
            max={400}
            step={10}
            className="w-32"
          />
          <span className="font-mono-data text-xs">{zoom}%</span>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono-data text-xs">
            Latency: 8ms
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default Pick;
