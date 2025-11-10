import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";

const mockStations = Array.from({ length: 50 }, (_, i) => ({
  id: `STA${i.toString().padStart(3, "0")}`,
  network: ["PQ", "XL", "EO"][i % 3],
  status: i % 7 === 0 ? "warning" : "ok",
  latency: Math.floor(Math.random() * 200) + 20,
  lastSample: new Date(Date.now() - Math.random() * 60000),
}));

const StationGrid = () => {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {mockStations.map((station) => (
        <Card
          key={station.id}
          className="cursor-pointer border-border bg-card transition-colors hover:border-primary/50"
        >
          <div className="p-3">
            {/* Header */}
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono-data text-sm font-semibold">
                  {station.network}.{station.id}
                </span>
                {station.status === "ok" ? (
                  <CheckCircle className="h-3 w-3 text-primary" />
                ) : (
                  <AlertCircle className="h-3 w-3 text-destructive" />
                )}
              </div>
              <span className="font-mono-data text-xs text-muted-foreground">
                {station.latency}ms
              </span>
            </div>

            {/* Mini Waveform Sparkline */}
            <div className="mb-2 h-12 overflow-hidden rounded bg-muted/30">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 100 48"
                preserveAspectRatio="none"
                className="stroke-waveform"
              >
                <polyline
                  fill="none"
                  strokeWidth="1"
                  points={Array.from({ length: 100 }, (_, i) => {
                    const y = 24 + Math.sin(i / 5) * 10 + Math.random() * 4;
                    return `${i},${y}`;
                  }).join(" ")}
                />
              </svg>
            </div>

            {/* Mini Rails */}
            <div className="flex gap-1">
              <div className="h-2 flex-1 overflow-hidden rounded bg-muted/30">
                <div
                  className="h-full bg-rail-p"
                  style={{ width: `${Math.random() * 60 + 20}%` }}
                />
              </div>
              <div className="h-2 flex-1 overflow-hidden rounded bg-muted/30">
                <div
                  className="h-full bg-rail-s"
                  style={{ width: `${Math.random() * 60 + 20}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StationGrid;
