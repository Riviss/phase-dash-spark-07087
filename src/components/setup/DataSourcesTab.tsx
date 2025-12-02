import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAreas } from "@/contexts/AreaContext";
import { useAreaConfig } from "@/contexts/AreaConfigContext";
import CopyConfigDialog from "./CopyConfigDialog";

const DataSourcesTab = () => {
  const { selectedAreaId, selectedArea } = useAreas();
  const { getConfig, updateDataSourceConfig } = useAreaConfig();
  
  const config = getConfig(selectedAreaId).dataSources;

  const handleSave = () => {
    toast({ title: "Settings saved", description: `Data source settings saved for ${selectedArea?.name}` });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-sm">
          {selectedArea?.name || "No area selected"}
        </Badge>
        <CopyConfigDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ringserver Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ringserver-host">Host</Label>
              <Input
                id="ringserver-host"
                value={config.ringserverHost}
                onChange={(e) => updateDataSourceConfig(selectedAreaId, { ringserverHost: e.target.value })}
                className="font-mono-data"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ring-size">Ring Size (GB)</Label>
              <Input
                id="ring-size"
                type="number"
                value={config.ringSize}
                onChange={(e) => updateDataSourceConfig(selectedAreaId, { ringSize: parseInt(e.target.value) || 0 })}
                className="font-mono-data"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max-clients">Max Clients</Label>
              <Input
                id="max-clients"
                type="number"
                value={config.maxClients}
                onChange={(e) => updateDataSourceConfig(selectedAreaId, { maxClients: parseInt(e.target.value) || 0 })}
                className="font-mono-data"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                type="number"
                value={config.port}
                onChange={(e) => updateDataSourceConfig(selectedAreaId, { port: parseInt(e.target.value) || 0 })}
                className="font-mono-data"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ntp-server">NTP Server</Label>
            <Input
              id="ntp-server"
              value={config.ntpServer}
              onChange={(e) => updateDataSourceConfig(selectedAreaId, { ntpServer: e.target.value })}
              className="font-mono-data"
            />
          </div>

          <div className="flex items-center gap-3 rounded-md border border-border bg-muted/30 p-3">
            <CheckCircle className="h-5 w-5 text-primary" />
            <div>
              <div className="text-sm font-medium">Status: Connected</div>
              <div className="text-xs text-muted-foreground">
                Ring fill: 42% • Latency: 45ms • Clients: 3/10
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Test Connection
            </Button>
            <Button variant="outline" size="sm">
              List Streams
            </Button>
            <Button size="sm" onClick={handleSave}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Historical Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fs-path">File System Path Template</Label>
            <Input
              id="fs-path"
              value={config.fsPathTemplate}
              onChange={(e) => updateDataSourceConfig(selectedAreaId, { fsPathTemplate: e.target.value })}
              className="font-mono-data text-xs"
            />
            <p className="text-xs text-muted-foreground">
              Supports: {"{year}"}, {"{month}"}, {"{day}"}, {"{yearmonthday}"}, {"{network}"}, {"{station}"}, {"{channel}"}
            </p>
          </div>

          <Button variant="outline" size="sm">
            Test Path Access
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resampling</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="target-rate">Target Sample Rate (Hz)</Label>
            <Input
              id="target-rate"
              type="number"
              value={config.targetSampleRate}
              onChange={(e) => updateDataSourceConfig(selectedAreaId, { targetSampleRate: parseInt(e.target.value) || 100 })}
              className="font-mono-data"
            />
            <p className="text-xs text-muted-foreground">
              All incoming data will be resampled to this rate
            </p>
          </div>

          <Badge variant="secondary" className="text-xs">
            <CheckCircle className="mr-1 h-3 w-3" />
            Resample enforced for ingest worker
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataSourcesTab;
