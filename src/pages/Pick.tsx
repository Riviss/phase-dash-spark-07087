import { useState, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import TrackStack from "@/components/pick/TrackStack";
import PickInspector from "@/components/pick/PickInspector";
import EventsRail from "@/components/pick/EventsRail";
import PhasePicker, { PhaseType } from "@/components/pick/PhasePicker";
import { PhasePick } from "@/components/pick/TrackRow";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

const Pick = () => {
  const [selectedPhase, setSelectedPhase] = useState<PhaseType>("P");
  const [picks, setPicks] = useState<Record<string, PhasePick[]>>({});

  const handleAddPick = (trackId: string, position: number) => {
    const newPick: PhasePick = {
      type: selectedPhase,
      position,
      id: `${trackId}-${selectedPhase}-${Date.now()}`,
    };
    
    console.log("Adding pick:", { trackId, position, selectedPhase, newPick });
    
    setPicks((prev) => {
      const updated = {
        ...prev,
        [trackId]: [...(prev[trackId] || []), newPick],
      };
      console.log("Updated picks state:", updated);
      return updated;
    });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "1") {
        setSelectedPhase("P");
      } else if (e.key === "2") {
        setSelectedPhase("S");
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
          <span className="font-mono-data font-medium">2024-01-15 14:23:42</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">M</span>
          <Badge variant="secondary" className="font-mono-data text-xs">
            2.8
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Depth:</span>
          <span className="font-mono-data">4.2 km</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">RMS:</span>
          <span className="font-mono-data">0.12s</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Gap:</span>
          <span className="font-mono-data">85°</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">H-Err:</span>
          <span className="font-mono-data">±0.8 km</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Z-Err:</span>
          <span className="font-mono-data">±1.2 km</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <PhasePicker
            selectedPhase={selectedPhase}
            onPhaseSelect={setSelectedPhase}
          />

          <label className="flex cursor-pointer items-center gap-1.5">
            <input type="checkbox" className="h-3 w-3 rounded" defaultChecked />
            <span className="text-muted-foreground">Theoretical</span>
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
          <EventsRail />
        </ResizablePanel>

        <ResizableHandle />

        {/* Track Stack */}
        <ResizablePanel defaultSize={60}>
          <div className="h-full overflow-auto">
            <TrackStack picks={picks} onAddPick={handleAddPick} />
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
            defaultValue={[50]}
            max={100}
            step={1}
            className="w-32"
          />
          <span className="font-mono-data text-xs">150%</span>
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
