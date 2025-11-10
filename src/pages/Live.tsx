import { Clock, Wifi, Zap, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StationGrid from "@/components/live/StationGrid";
import HotspotTimeline from "@/components/live/HotspotTimeline";

const Live = () => {
  const currentUTC = new Date().toISOString().split(".")[0] + "Z";

  return (
    <div className="flex h-full flex-col">
      {/* Header Widgets */}
      <div className="flex items-center gap-4 border-b border-border bg-card px-4 py-2">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono-data text-sm">{currentUTC}</span>
        </div>

        <div className="flex items-center gap-2">
          <Wifi className="h-4 w-4 text-primary" />
          <span className="text-xs">rtserve.iris.washington.edu:18000</span>
          <Badge variant="secondary" className="h-5 text-[10px]">
            Connected
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs">Latency: 42ms</span>
        </div>

        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs">Model: EQTransformer v2.1</span>
        </div>

        <div className="ml-auto">
          <Badge variant="outline" className="font-mono-data text-xs">
            147 stations
          </Badge>
        </div>
      </div>

      {/* Hotspot Timeline Strip */}
      <div className="border-b border-border bg-card p-4">
        <Card className="border-0">
          <CardHeader className="p-3">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Event Brightness (Σ P+S)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <HotspotTimeline />
          </CardContent>
        </Card>
      </div>

      {/* Station Grid */}
      <div className="flex-1 overflow-auto p-4">
        <StationGrid />
      </div>
    </div>
  );
};

export default Live;
