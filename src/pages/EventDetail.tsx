import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Download, MapPin, Clock, Gauge, Layers } from "lucide-react";

// Mock event data generator
const getEventData = (id: string) => {
  const seed = parseInt(id.replace("evt-", "")) || 0;
  const rand = (min: number, max: number) => min + ((seed * 9301 + 49297) % 233280) / 233280 * (max - min);
  
  return {
    id,
    time: new Date(Date.now() - rand(0, 7) * 24 * 60 * 60 * 1000),
    lat: 49.5 + (rand(-1, 1) * 2.5),
    lon: -114 + (rand(-1, 1) * 5),
    depth: rand(0, 20),
    magnitude: rand(1, 4),
    magnitudeType: "ML",
    rms: rand(0.05, 0.3),
    gap: rand(30, 180),
    nst: Math.floor(rand(10, 50)),
    horizontalError: rand(0.5, 3),
    depthError: rand(1, 5),
    magnitudeError: rand(0.1, 0.4),
    agency: "WCSB",
    status: "reviewed",
    picks: Array.from({ length: Math.floor(rand(15, 40)) }, (_, i) => ({
      station: `STA${i.toString().padStart(3, "0")}`,
      network: ["PQ", "XL", "EO"][i % 3],
      phase: i % 3 === 0 ? "S" : "P",
      time: new Date(Date.now() - rand(0, 60) * 1000),
      residual: (rand(-1, 1) * 0.3),
      weight: rand(0.5, 1),
      distance: rand(5, 150),
      azimuth: rand(0, 360),
      polarity: i % 4 === 0 ? "+" : i % 4 === 1 ? "-" : "?",
    })),
    focalMechanism: {
      strike: rand(0, 360),
      dip: rand(20, 80),
      rake: rand(-180, 180),
    },
  };
};

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const event = getEventData(eventId || "evt-0000");

  const pPicks = event.picks.filter(p => p.phase === "P");
  const sPicks = event.picks.filter(p => p.phase === "S");

  return (
    <div className="h-full overflow-auto p-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/events")} className="mb-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
          <h1 className="mb-1 text-2xl font-semibold">Event {event.id}</h1>
          <p className="font-mono-data text-sm text-muted-foreground">
            {event.time.toISOString().replace("T", " ").split(".")[0]} UTC
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant={event.status === "reviewed" ? "default" : "secondary"}>
            {event.status}
          </Badge>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export QuakeML
          </Button>
        </div>
      </div>

      {/* Key Parameters */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-xs">Location</span>
            </div>
            <div className="mt-1 font-mono-data text-lg font-semibold">
              {event.lat.toFixed(4)}°, {event.lon.toFixed(4)}°
            </div>
            <div className="text-xs text-muted-foreground">
              ±{event.horizontalError.toFixed(1)} km
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Layers className="h-4 w-4" />
              <span className="text-xs">Depth</span>
            </div>
            <div className="mt-1 font-mono-data text-lg font-semibold">
              {event.depth.toFixed(1)} km
            </div>
            <div className="text-xs text-muted-foreground">
              ±{event.depthError.toFixed(1)} km
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Gauge className="h-4 w-4" />
              <span className="text-xs">Magnitude</span>
            </div>
            <div className="mt-1 font-mono-data text-lg font-semibold">
              {event.magnitudeType} {event.magnitude.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">
              ±{event.magnitudeError.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-xs">Quality</span>
            </div>
            <div className="mt-1 font-mono-data text-lg font-semibold">
              RMS {event.rms.toFixed(2)}s
            </div>
            <div className="text-xs text-muted-foreground">
              Gap: {event.gap.toFixed(0)}° | {event.nst} stations
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Picks Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Phase Picks ({event.picks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[400px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Station</TableHead>
                    <TableHead>Phase</TableHead>
                    <TableHead>Polarity</TableHead>
                    <TableHead className="text-right">Residual</TableHead>
                    <TableHead className="text-right">Distance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {event.picks.map((pick, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono-data">
                        {pick.network}.{pick.station}
                      </TableCell>
                      <TableCell>
                        <Badge variant={pick.phase === "P" ? "default" : "secondary"}>
                          {pick.phase}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono-data">{pick.polarity}</TableCell>
                      <TableCell className={`font-mono-data text-right ${Math.abs(pick.residual) > 0.2 ? "text-destructive" : ""}`}>
                        {pick.residual > 0 ? "+" : ""}{pick.residual.toFixed(3)}s
                      </TableCell>
                      <TableCell className="font-mono-data text-right">
                        {pick.distance.toFixed(1)} km
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Focal Mechanism */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Focal Mechanism</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xs text-muted-foreground">Strike</div>
                <div className="font-mono-data text-lg font-semibold">{event.focalMechanism.strike.toFixed(0)}°</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Dip</div>
                <div className="font-mono-data text-lg font-semibold">{event.focalMechanism.dip.toFixed(0)}°</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Rake</div>
                <div className="font-mono-data text-lg font-semibold">{event.focalMechanism.rake.toFixed(0)}°</div>
              </div>
            </div>
            <div className="flex h-48 items-center justify-center rounded bg-muted/30">
              <span className="text-sm text-muted-foreground">Beach ball diagram</span>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              P polarities: {pPicks.filter(p => p.polarity === "+").length} up, {pPicks.filter(p => p.polarity === "-").length} down
            </div>
          </CardContent>
        </Card>

        {/* Moveout Plot */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distance-Time Moveout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-center justify-center rounded bg-muted/30">
              <span className="text-sm text-muted-foreground">Moveout plot placeholder</span>
            </div>
          </CardContent>
        </Card>

        {/* Residual Plot */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Residuals by Azimuth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-center justify-center rounded bg-muted/30">
              <span className="text-sm text-muted-foreground">Azimuthal residual plot placeholder</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventDetail;
