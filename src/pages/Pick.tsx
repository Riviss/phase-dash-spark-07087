import { Play, Pause, SkipBack, SkipForward, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import TrackStack from "@/components/pick/TrackStack";
import PickInspector from "@/components/pick/PickInspector";

const Pick = () => {
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

      {/* Main Editor Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Track Stack */}
        <div className="flex-1 overflow-auto">
          <TrackStack />
        </div>

        {/* Right Inspector */}
        <PickInspector />
      </div>

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
