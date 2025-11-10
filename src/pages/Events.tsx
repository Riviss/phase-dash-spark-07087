import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Download, Filter, Search } from "lucide-react";

const mockEvents = Array.from({ length: 50 }, (_, i) => ({
  id: `evt-${i}`,
  time: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
  lat: 49.5 + (Math.random() - 0.5) * 5,
  lon: -114 + (Math.random() - 0.5) * 10,
  depth: Math.random() * 20,
  magnitude: Math.random() * 3 + 1,
  stations: Math.floor(Math.random() * 50) + 10,
  residual: (Math.random() - 0.5) * 0.5,
}));

const Events = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="h-full overflow-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-semibold">Events Browser</h1>
          <p className="text-sm text-muted-foreground">
            Search, filter, and export detected events
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Selected
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search events by ID, time, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Events ({mockEvents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="pb-3 font-medium">Time (UTC)</th>
                  <th className="pb-3 font-medium">Latitude</th>
                  <th className="pb-3 font-medium">Longitude</th>
                  <th className="pb-3 font-medium">Depth (km)</th>
                  <th className="pb-3 font-medium">Magnitude</th>
                  <th className="pb-3 font-medium">Stations</th>
                  <th className="pb-3 font-medium">Max Residual</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {mockEvents.slice(0, 20).map((event) => (
                  <tr
                    key={event.id}
                    className="cursor-pointer border-b border-border/50 transition-colors hover:bg-muted/30"
                  >
                    <td className="py-3 font-mono-data text-xs">
                      {event.time.toISOString().replace("T", " ").split(".")[0]}
                    </td>
                    <td className="py-3 font-mono-data text-xs">
                      {event.lat.toFixed(4)}°
                    </td>
                    <td className="py-3 font-mono-data text-xs">
                      {event.lon.toFixed(4)}°
                    </td>
                    <td className="py-3 font-mono-data text-xs">
                      {event.depth.toFixed(1)}
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={
                          event.magnitude > 2.5 ? "default" : "secondary"
                        }
                        className="font-mono-data text-xs"
                      >
                        M {event.magnitude.toFixed(1)}
                      </Badge>
                    </td>
                    <td className="py-3 font-mono-data text-xs">
                      {event.stations}
                    </td>
                    <td className="py-3 font-mono-data text-xs">
                      {event.residual > 0 ? "+" : ""}
                      {event.residual.toFixed(2)}s
                    </td>
                    <td className="py-3">
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Events;
