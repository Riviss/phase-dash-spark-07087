import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Download, Filter, Search, ChevronDown, ChevronUp, X } from "lucide-react";

const mockEvents = Array.from({ length: 50 }, (_, i) => ({
  id: `evt-${i.toString().padStart(4, "0")}`,
  time: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
  lat: 49.5 + (Math.random() - 0.5) * 5,
  lon: -114 + (Math.random() - 0.5) * 10,
  depth: Math.random() * 20,
  magnitude: Math.random() * 3 + 1,
  stations: Math.floor(Math.random() * 50) + 10,
  residual: (Math.random() - 0.5) * 0.5,
}));

const Events = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minMag: "",
    maxMag: "",
    minDepth: "",
    maxDepth: "",
    minLat: "",
    maxLat: "",
    minLon: "",
    maxLon: "",
    minStations: "",
    maxResidual: "",
    startDate: "",
    endDate: "",
  });

  const clearFilters = () => {
    setFilters({
      minMag: "", maxMag: "", minDepth: "", maxDepth: "",
      minLat: "", maxLat: "", minLon: "", maxLon: "",
      minStations: "", maxResidual: "", startDate: "", endDate: "",
    });
  };

  const filteredEvents = mockEvents.filter((event) => {
    if (searchTerm && !event.id.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filters.minMag && event.magnitude < parseFloat(filters.minMag)) return false;
    if (filters.maxMag && event.magnitude > parseFloat(filters.maxMag)) return false;
    if (filters.minDepth && event.depth < parseFloat(filters.minDepth)) return false;
    if (filters.maxDepth && event.depth > parseFloat(filters.maxDepth)) return false;
    if (filters.minLat && event.lat < parseFloat(filters.minLat)) return false;
    if (filters.maxLat && event.lat > parseFloat(filters.maxLat)) return false;
    if (filters.minLon && event.lon < parseFloat(filters.minLon)) return false;
    if (filters.maxLon && event.lon > parseFloat(filters.maxLon)) return false;
    if (filters.minStations && event.stations < parseInt(filters.minStations)) return false;
    if (filters.maxResidual && Math.abs(event.residual) > parseFloat(filters.maxResidual)) return false;
    if (filters.startDate && event.time < new Date(filters.startDate)) return false;
    if (filters.endDate && event.time > new Date(filters.endDate)) return false;
    return true;
  });

  const activeFilterCount = Object.values(filters).filter(v => v !== "").length;

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
          <Button 
            variant={showFilters ? "default" : "outline"} 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">{activeFilterCount}</Badge>
            )}
            {showFilters ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Selected
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search events by ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Filter Parameters</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="mr-1 h-4 w-4" />
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
              <div className="space-y-1">
                <Label className="text-xs">Min Magnitude</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={filters.minMag}
                  onChange={(e) => setFilters({ ...filters, minMag: e.target.value })}
                  className="font-mono-data"
                  placeholder="0.0"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Max Magnitude</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={filters.maxMag}
                  onChange={(e) => setFilters({ ...filters, maxMag: e.target.value })}
                  className="font-mono-data"
                  placeholder="10.0"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Min Depth (km)</Label>
                <Input
                  type="number"
                  value={filters.minDepth}
                  onChange={(e) => setFilters({ ...filters, minDepth: e.target.value })}
                  className="font-mono-data"
                  placeholder="0"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Max Depth (km)</Label>
                <Input
                  type="number"
                  value={filters.maxDepth}
                  onChange={(e) => setFilters({ ...filters, maxDepth: e.target.value })}
                  className="font-mono-data"
                  placeholder="700"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Min Latitude</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={filters.minLat}
                  onChange={(e) => setFilters({ ...filters, minLat: e.target.value })}
                  className="font-mono-data"
                  placeholder="-90"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Max Latitude</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={filters.maxLat}
                  onChange={(e) => setFilters({ ...filters, maxLat: e.target.value })}
                  className="font-mono-data"
                  placeholder="90"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Min Longitude</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={filters.minLon}
                  onChange={(e) => setFilters({ ...filters, minLon: e.target.value })}
                  className="font-mono-data"
                  placeholder="-180"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Max Longitude</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={filters.maxLon}
                  onChange={(e) => setFilters({ ...filters, maxLon: e.target.value })}
                  className="font-mono-data"
                  placeholder="180"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Min Stations</Label>
                <Input
                  type="number"
                  value={filters.minStations}
                  onChange={(e) => setFilters({ ...filters, minStations: e.target.value })}
                  className="font-mono-data"
                  placeholder="0"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Max Residual (s)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={filters.maxResidual}
                  onChange={(e) => setFilters({ ...filters, maxResidual: e.target.value })}
                  className="font-mono-data"
                  placeholder="1.0"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Start Date</Label>
                <Input
                  type="datetime-local"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="font-mono-data"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">End Date</Label>
                <Input
                  type="datetime-local"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="font-mono-data"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Events ({filteredEvents.length})
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
                {filteredEvents.slice(0, 20).map((event) => (
                  <tr
                    key={event.id}
                    className="cursor-pointer border-b border-border/50 transition-colors hover:bg-muted/30"
                    onClick={() => navigate(`/events/${event.id}`)}
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
                        variant={event.magnitude > 2.5 ? "default" : "secondary"}
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
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/events/${event.id}`);
                        }}
                      >
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
