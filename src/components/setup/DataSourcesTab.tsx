import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

const DataSourcesTab = () => {
  return (
    <div className="space-y-6">
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
                defaultValue="rtserve.iris.washington.edu:18000"
                className="font-mono-data"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ring-size">Ring Size (GB)</Label>
              <Input
                id="ring-size"
                type="number"
                defaultValue="2"
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
                defaultValue="10"
                className="font-mono-data"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                type="number"
                defaultValue="18000"
                className="font-mono-data"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ntp-server">NTP Server</Label>
            <Input
              id="ntp-server"
              defaultValue="time.google.com"
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
            <Button size="sm">Save Changes</Button>
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
              defaultValue="/home/pgcseiscomp/antelope/wfs/{year}/{month}/{day}/{yearmonthday}.{network}.{station}..{channel}.mseed"
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
              defaultValue="100"
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
