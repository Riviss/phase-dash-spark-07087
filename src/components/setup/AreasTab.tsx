import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Plus, Trash2, Server, Edit, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Area {
  id: string;
  name: string;
  minLat: string;
  maxLat: string;
  minLon: string;
  maxLon: string;
  networks: string[];
}

interface SeedlinkServer {
  id: string;
  name: string;
  host: string;
  port: number;
  areaId: string;
}

interface StationConfig {
  network: string;
  station: string;
  channels: string;
  seedlinkId: string;
  areaId: string;
}

const AREAS_STORAGE_KEY = "seismic-areas";
const SELECTED_AREA_KEY = "seismic-selected-area";

const defaultArea: Area = {
  id: "wcsb",
  name: "Western Canada Sedimentary Basin",
  minLat: "48.0",
  maxLat: "52.0",
  minLon: "-120.0",
  maxLon: "-108.0",
  networks: ["PQ", "XL", "EO"],
};

const mockSeedlinkServers: SeedlinkServer[] = [
  { id: "sl1", name: "Primary IRIS", host: "rtserve.iris.washington.edu", port: 18000, areaId: "wcsb" },
  { id: "sl2", name: "Local Ringserver", host: "localhost", port: 16000, areaId: "wcsb" },
  { id: "sl3", name: "GEOFON", host: "geofon.gfz-potsdam.de", port: 18000, areaId: "wcsb" },
];

const mockStations: StationConfig[] = [
  { network: "PQ", station: "STA001", channels: "HH*", seedlinkId: "sl1", areaId: "wcsb" },
  { network: "PQ", station: "STA002", channels: "HH*", seedlinkId: "sl1", areaId: "wcsb" },
  { network: "XL", station: "STA003", channels: "BH*", seedlinkId: "sl2", areaId: "wcsb" },
  { network: "EO", station: "STA004", channels: "HH*", seedlinkId: "sl3", areaId: "wcsb" },
];

const AreasTab = () => {
  const [areas, setAreas] = useState<Area[]>(() => {
    const stored = localStorage.getItem(AREAS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [defaultArea];
  });
  
  const [selectedAreaId, setSelectedAreaId] = useState<string>(() => {
    return localStorage.getItem(SELECTED_AREA_KEY) || areas[0]?.id || "";
  });

  const [seedlinkServers, setSeedlinkServers] = useState<SeedlinkServer[]>(mockSeedlinkServers);
  const [stations, setStations] = useState<StationConfig[]>(mockStations);
  const [newServer, setNewServer] = useState({ name: "", host: "", port: 18000 });
  
  // Dialog state
  const [isAddAreaOpen, setIsAddAreaOpen] = useState(false);
  const [isEditAreaOpen, setIsEditAreaOpen] = useState(false);
  const [newArea, setNewArea] = useState<Omit<Area, "id">>({
    name: "",
    minLat: "",
    maxLat: "",
    minLon: "",
    maxLon: "",
    networks: [],
  });
  const [editingArea, setEditingArea] = useState<Area | null>(null);
  const [networkInput, setNetworkInput] = useState("");

  // Persist areas to localStorage
  useEffect(() => {
    localStorage.setItem(AREAS_STORAGE_KEY, JSON.stringify(areas));
  }, [areas]);

  // Persist selected area
  useEffect(() => {
    localStorage.setItem(SELECTED_AREA_KEY, selectedAreaId);
  }, [selectedAreaId]);

  const selectedArea = areas.find(a => a.id === selectedAreaId);

  const isDuplicateName = (name: string, excludeId?: string): boolean => {
    return areas.some(a => 
      a.name.toLowerCase().trim() === name.toLowerCase().trim() && 
      a.id !== excludeId
    );
  };

  const addArea = () => {
    if (!newArea.name.trim()) {
      toast({ title: "Error", description: "Area name is required", variant: "destructive" });
      return;
    }
    
    if (isDuplicateName(newArea.name)) {
      toast({ title: "Error", description: "An area with this name already exists", variant: "destructive" });
      return;
    }

    const id = newArea.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const area: Area = { ...newArea, id: `${id}-${Date.now()}` };
    
    setAreas([...areas, area]);
    setSelectedAreaId(area.id);
    setNewArea({ name: "", minLat: "", maxLat: "", minLon: "", maxLon: "", networks: [] });
    setIsAddAreaOpen(false);
    
    toast({ title: "Area added", description: `${area.name} has been created` });
  };

  const updateArea = () => {
    if (!editingArea) return;
    
    if (!editingArea.name.trim()) {
      toast({ title: "Error", description: "Area name is required", variant: "destructive" });
      return;
    }
    
    if (isDuplicateName(editingArea.name, editingArea.id)) {
      toast({ title: "Error", description: "An area with this name already exists", variant: "destructive" });
      return;
    }

    setAreas(areas.map(a => a.id === editingArea.id ? editingArea : a));
    setIsEditAreaOpen(false);
    setEditingArea(null);
    
    toast({ title: "Area updated", description: `${editingArea.name} has been updated` });
  };

  const deleteArea = (id: string) => {
    if (areas.length <= 1) {
      toast({ title: "Error", description: "Cannot delete the last area", variant: "destructive" });
      return;
    }
    
    const areaToDelete = areas.find(a => a.id === id);
    setAreas(areas.filter(a => a.id !== id));
    
    if (selectedAreaId === id) {
      const remaining = areas.filter(a => a.id !== id);
      setSelectedAreaId(remaining[0]?.id || "");
    }
    
    toast({ title: "Area deleted", description: `${areaToDelete?.name} has been removed` });
  };

  const openEditDialog = (area: Area) => {
    setEditingArea({ ...area });
    setIsEditAreaOpen(true);
  };

  const addNetworkToNewArea = () => {
    if (networkInput.trim() && !newArea.networks.includes(networkInput.trim().toUpperCase())) {
      setNewArea({ ...newArea, networks: [...newArea.networks, networkInput.trim().toUpperCase()] });
      setNetworkInput("");
    }
  };

  const addNetworkToEditingArea = () => {
    if (editingArea && networkInput.trim() && !editingArea.networks.includes(networkInput.trim().toUpperCase())) {
      setEditingArea({ ...editingArea, networks: [...editingArea.networks, networkInput.trim().toUpperCase()] });
      setNetworkInput("");
    }
  };

  const addSeedlinkServer = () => {
    if (newServer.name && newServer.host && selectedAreaId) {
      setSeedlinkServers([
        ...seedlinkServers,
        { ...newServer, id: `sl${Date.now()}`, areaId: selectedAreaId }
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

  const filteredServers = seedlinkServers.filter(s => s.areaId === selectedAreaId);
  const filteredStations = stations.filter(s => s.areaId === selectedAreaId);

  return (
    <div className="space-y-6">
      {/* Area Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg">
            <span className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Areas
            </span>
            <Dialog open={isAddAreaOpen} onOpenChange={setIsAddAreaOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-1 h-4 w-4" />
                  Add Area
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Area</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-area-name">Area Name *</Label>
                    <Input
                      id="new-area-name"
                      value={newArea.name}
                      onChange={(e) => setNewArea({ ...newArea, name: e.target.value })}
                      placeholder="e.g., Western Canada Basin"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Boundaries</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Min Lat"
                        value={newArea.minLat}
                        onChange={(e) => setNewArea({ ...newArea, minLat: e.target.value })}
                        className="font-mono-data"
                      />
                      <Input
                        placeholder="Max Lat"
                        value={newArea.maxLat}
                        onChange={(e) => setNewArea({ ...newArea, maxLat: e.target.value })}
                        className="font-mono-data"
                      />
                      <Input
                        placeholder="Min Lon"
                        value={newArea.minLon}
                        onChange={(e) => setNewArea({ ...newArea, minLon: e.target.value })}
                        className="font-mono-data"
                      />
                      <Input
                        placeholder="Max Lon"
                        value={newArea.maxLon}
                        onChange={(e) => setNewArea({ ...newArea, maxLon: e.target.value })}
                        className="font-mono-data"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Networks</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Network code (e.g., PQ)"
                        value={networkInput}
                        onChange={(e) => setNetworkInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addNetworkToNewArea())}
                        className="font-mono-data"
                      />
                      <Button type="button" variant="outline" size="sm" onClick={addNetworkToNewArea}>
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {newArea.networks.map((n) => (
                        <Badge key={n} variant="secondary" className="font-mono-data">
                          {n}
                          <button
                            className="ml-1 hover:text-destructive"
                            onClick={() => setNewArea({ ...newArea, networks: newArea.networks.filter(x => x !== n) })}
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={addArea}>Add Area</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {areas.map((area) => (
              <div
                key={area.id}
                className={`group flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer transition-colors ${
                  selectedAreaId === area.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedAreaId(area.id)}
              >
                <span className="font-medium">{area.name}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => { e.stopPropagation(); openEditDialog(area); }}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-destructive"
                    onClick={(e) => { e.stopPropagation(); deleteArea(area.id); }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Area Dialog */}
      <Dialog open={isEditAreaOpen} onOpenChange={setIsEditAreaOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Area</DialogTitle>
          </DialogHeader>
          {editingArea && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-area-name">Area Name *</Label>
                <Input
                  id="edit-area-name"
                  value={editingArea.name}
                  onChange={(e) => setEditingArea({ ...editingArea, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Boundaries</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Min Lat"
                    value={editingArea.minLat}
                    onChange={(e) => setEditingArea({ ...editingArea, minLat: e.target.value })}
                    className="font-mono-data"
                  />
                  <Input
                    placeholder="Max Lat"
                    value={editingArea.maxLat}
                    onChange={(e) => setEditingArea({ ...editingArea, maxLat: e.target.value })}
                    className="font-mono-data"
                  />
                  <Input
                    placeholder="Min Lon"
                    value={editingArea.minLon}
                    onChange={(e) => setEditingArea({ ...editingArea, minLon: e.target.value })}
                    className="font-mono-data"
                  />
                  <Input
                    placeholder="Max Lon"
                    value={editingArea.maxLon}
                    onChange={(e) => setEditingArea({ ...editingArea, maxLon: e.target.value })}
                    className="font-mono-data"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Networks</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Network code"
                    value={networkInput}
                    onChange={(e) => setNetworkInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addNetworkToEditingArea())}
                    className="font-mono-data"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={addNetworkToEditingArea}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {editingArea.networks.map((n) => (
                    <Badge key={n} variant="secondary" className="font-mono-data">
                      {n}
                      <button
                        className="ml-1 hover:text-destructive"
                        onClick={() => setEditingArea({ ...editingArea, networks: editingArea.networks.filter(x => x !== n) })}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={updateArea}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Area Configuration (read-only summary) */}
      {selectedArea && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Area Configuration: {selectedArea.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Boundaries</Label>
                <p className="font-mono-data text-sm">
                  Lat: {selectedArea.minLat || "—"} to {selectedArea.maxLat || "—"}, 
                  Lon: {selectedArea.minLon || "—"} to {selectedArea.maxLon || "—"}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Networks</Label>
                <div className="flex flex-wrap gap-1">
                  {selectedArea.networks.length > 0 ? (
                    selectedArea.networks.map((n) => (
                      <Badge key={n} variant="secondary" className="font-mono-data">{n}</Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">No networks configured</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
              {filteredServers.map((server) => (
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
              {filteredServers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No seedlink servers configured for this area
                  </TableCell>
                </TableRow>
              )}
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
              {filteredStations.map((station, index) => (
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
                        {filteredServers.map((server) => (
                          <SelectItem key={server.id} value={server.id}>
                            {server.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
              {filteredStations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No stations configured for this area
                  </TableCell>
                </TableRow>
              )}
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
            <Badge variant="outline" className="font-mono-data">{filteredStations.length} stations configured</Badge>
            <Badge variant="outline" className="font-mono-data">{filteredServers.length} seedlink servers</Badge>
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
