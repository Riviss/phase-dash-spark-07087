import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Server } from "lucide-react";

interface SeedlinkServer {
  id: string;
  name: string;
  host: string;
  port: number;
}

interface StationConfig {
  network: string;
  station: string;
  channels: string;
  seedlinkId: string;
}

const mockSeedlinkServers: SeedlinkServer[] = [
  { id: "sl1", name: "Primary IRIS", host: "rtserve.iris.washington.edu", port: 18000 },
  { id: "sl2", name: "Local Ringserver", host: "localhost", port: 16000 },
  { id: "sl3", name: "GEOFON", host: "geofon.gfz-potsdam.de", port: 18000 },
];

const mockStations: StationConfig[] = [
  { network: "PQ", station: "STA001", channels: "HH*", seedlinkId: "sl1" },
  { network: "PQ", station: "STA002", channels: "HH*", seedlinkId: "sl1" },
  { network: "XL", station: "STA003", channels: "BH*", seedlinkId: "sl2" },
  { network: "EO", station: "STA004", channels: "HH*", seedlinkId: "sl3" },
];

const AreasTab = () => {
  const [seedlinkServers, setSeedlinkServers] = useState<SeedlinkServer[]>(mockSeedlinkServers);
  const [stations, setStations] = useState<StationConfig[]>(mockStations);
  const [newServer, setNewServer] = useState({ name: "", host: "", port: 18000 });

  const addSeedlinkServer = () => {
    if (newServer.name && newServer.host) {
      setSeedlinkServers([
        ...seedlinkServers,
        { ...newServer, id: `sl${Date.now()}` }
      ]);
      setNewServer({ name: "", host: "", port: 18000 });
    }
  };

  const removeSeedlinkServer = (id: string) => {
    setSeedlinkServers(seedlinkServers.filter(s => s.id !== id));
  };

  const updateStationSeedlink = (index: number, seedlinkId: string) => {
    const updated = [...stations];
    updated[index].seedlinkId = seedlinkId;
    setStations(updated);
  };

  return (
    <div className="space-y-6">
      {/* Area Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Area Configuration: WCSB</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="area-id">Area ID</Label>
              <Input id="area-id" defaultValue="WCSB" className="font-mono-data" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area-name">Name</Label>
              <Input id="area-name" defaultValue="Western Canada Sedimentary Basin" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Boundaries</Label>
            <div className="grid grid-cols-4 gap-2">
              <Input placeholder="Min Lat" defaultValue="48.0" className="font-mono-data" />
              <Input placeholder="Max Lat" defaultValue="52.0" className="font-mono-data" />
              <Input placeholder="Min Lon" defaultValue="-120.0" className="font-mono-data" />
              <Input placeholder="Max Lon" defaultValue="-108.0" className="font-mono-data" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Networks</Label>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="font-mono-data">PQ</Badge>
              <Badge variant="secondary" className="font-mono-data">XL</Badge>
              <Badge variant="secondary" className="font-mono-data">EO</Badge>
              <Button variant="outline" size="sm" className="h-6 text-xs">+ Add Network</Button>
            </div>
          </div>

          <Button size="sm">Save Area Configuration</Button>
        </CardContent>
      </Card>

      {/* Seedlink Servers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Server className="h-5 w-5" />
            Seedlink Servers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Host</TableHead>
                <TableHead>Port</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {seedlinkServers.map((server) => (
                <TableRow key={server.id}>
                  <TableCell className="font-medium">{server.name}</TableCell>
                  <TableCell className="font-mono-data">{server.host}</TableCell>
                  <TableCell className="font-mono-data">{server.port}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSeedlinkServer(server.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex gap-2 border-t border-border pt-4">
            <Input
              placeholder="Server name"
              value={newServer.name}
              onChange={(e) => setNewServer({ ...newServer, name: e.target.value })}
              className="flex-1"
            />
            <Input
              placeholder="Host"
              value={newServer.host}
              onChange={(e) => setNewServer({ ...newServer, host: e.target.value })}
              className="flex-1 font-mono-data"
            />
            <Input
              type="number"
              placeholder="Port"
              value={newServer.port}
              onChange={(e) => setNewServer({ ...newServer, port: parseInt(e.target.value) })}
              className="w-24 font-mono-data"
            />
            <Button onClick={addSeedlinkServer} size="sm">
              <Plus className="mr-1 h-4 w-4" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Station Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Station Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Network</TableHead>
                <TableHead>Station</TableHead>
                <TableHead>Channels</TableHead>
                <TableHead>Seedlink Server</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stations.map((station, index) => (
                <TableRow key={`${station.network}.${station.station}`}>
                  <TableCell className="font-mono-data">{station.network}</TableCell>
                  <TableCell className="font-mono-data">{station.station}</TableCell>
                  <TableCell className="font-mono-data">{station.channels}</TableCell>
                  <TableCell>
                    <Select
                      value={station.seedlinkId}
                      onValueChange={(value) => updateStationSeedlink(index, value)}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {seedlinkServers.map((server) => (
                          <SelectItem key={server.id} value={server.id}>
                            {server.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 flex gap-2">
            <Button variant="outline" size="sm">
              <Plus className="mr-1 h-4 w-4" />
              Add Station
            </Button>
            <Button variant="outline" size="sm">Import from FDSN</Button>
          </div>
        </CardContent>
      </Card>

      {/* Station Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Station Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-4">
            <Badge variant="outline" className="font-mono-data">{stations.length} stations configured</Badge>
            <Badge variant="outline" className="font-mono-data">{seedlinkServers.length} seedlink servers</Badge>
          </div>
          <div className="h-64 rounded bg-muted/30" />
          <p className="mt-2 text-xs text-muted-foreground">
            Station map with clustered markers and selection brush
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AreasTab;
