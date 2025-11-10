import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlayCircle, StopCircle } from "lucide-react";

const PipelinesTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Processing Pipeline</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <PlayCircle className="mr-2 h-4 w-4" />
              Start
            </Button>
            <Button variant="outline" size="sm">
              <StopCircle className="mr-2 h-4 w-4" />
              Stop
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <span className="text-sm font-medium">Ingest</span>
              <Badge variant="secondary" className="text-xs">Active</Badge>
            </div>
            <div className="text-muted-foreground">→</div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <span className="text-sm font-medium">Resample (100 Hz)</span>
              <Badge variant="secondary" className="text-xs">Active</Badge>
            </div>
            <div className="text-muted-foreground">→</div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <span className="text-sm font-medium">Picker</span>
              <Badge variant="secondary" className="text-xs">Active</Badge>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-muted-foreground">→</div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <span className="text-sm font-medium">Prob Rails (Zarr)</span>
              <Badge variant="secondary" className="text-xs">Active</Badge>
            </div>
            <div className="text-muted-foreground">→</div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <span className="text-sm font-medium">SSA</span>
              <Badge variant="secondary" className="text-xs">Active</Badge>
            </div>
            <div className="text-muted-foreground">→</div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <span className="text-sm font-medium">Catalog</span>
              <Badge variant="secondary" className="text-xs">Active</Badge>
            </div>
          </div>

          <div className="rounded-md border border-border bg-muted/30 p-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">Queue Depth</div>
                <div className="font-mono-data font-medium">142 / 1000</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Processing Rate</div>
                <div className="font-mono-data font-medium">24.5 evt/min</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Backpressure</div>
                <Badge variant="secondary" className="text-xs">None</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Storage Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prob-path">Probability Rails Path Template</Label>
            <Input
              id="prob-path"
              defaultValue="probabilities/{YYYY}/{MM}/{DD}/{YYYYMMDD}.{network}.{station}.zarr"
              className="font-mono-data text-xs"
            />
            <p className="text-xs text-muted-foreground">
              Supports: {"{YYYY}"}, {"{MM}"}, {"{DD}"}, {"{YYYYMMDD}"}, {"{network}"}, {"{station}"}
            </p>
          </div>

          <Button variant="outline" size="sm">
            Test Write Permissions
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PipelinesTab;
