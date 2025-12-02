import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MiniMap from "./MiniMap";

const PickInspector = () => {
  return (
    <aside className="w-72 overflow-auto border-l border-border bg-card">
      <div className="p-4">
        <Card className="border-0">
          <CardHeader className="p-3">
            <CardTitle className="text-sm">Pick Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-3 pt-0">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Phase</div>
              <Badge variant="secondary" className="font-mono-data">
                P
              </Badge>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">UTC Time</div>
              <div className="font-mono-data text-xs">
                2024-01-15T14:23:42.345Z
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">t-rel</div>
              <div className="font-mono-data text-xs">+2.345s</div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">SNR</div>
              <div className="font-mono-data text-xs">12.4 dB</div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Model Score</div>
              <div className="font-mono-data text-xs">0.94</div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Amplitude</div>
              <div className="font-mono-data text-xs">1.24e-6 m/s</div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Polarity</div>
              <Badge variant="outline" className="font-mono-data text-xs">
                +
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-3 border-0">
          <CardHeader className="p-3">
            <CardTitle className="text-sm">Residual</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="font-mono-data text-xs">-0.12s</div>
            <div className="mt-2 h-20 rounded bg-muted/30" />
          </CardContent>
        </Card>

        <Card className="mt-3 border-0">
          <CardHeader className="p-3">
            <CardTitle className="text-sm">Map</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <MiniMap 
              eventLat={51.5}
              eventLon={-114.5}
              stationLat={51.8}
              stationLon={-114.2}
              className="rounded"
            />
          </CardContent>
        </Card>
      </div>
    </aside>
  );
};

export default PickInspector;
