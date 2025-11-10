import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const AreasTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Area Configuration: WCSB</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="area-id">Area ID</Label>
              <Input
                id="area-id"
                defaultValue="WCSB"
                className="font-mono-data"
              />
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
              <Button variant="outline" size="sm" className="h-6 text-xs">
                + Add Network
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Excluded Networks</Label>
            <div className="flex flex-wrap gap-2">
              <Badge variant="destructive" className="font-mono-data">SY</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Channel Filters</Label>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="font-mono-data">HH*</Badge>
              <Badge variant="secondary" className="font-mono-data">BH*</Badge>
              <Button variant="outline" size="sm" className="h-6 text-xs">
                + Add Filter
              </Button>
            </div>
          </div>

          <Button size="sm">Save Area Configuration</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Station Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-4">
            <Badge variant="outline" className="font-mono-data">147 stations active</Badge>
            <Badge variant="outline" className="font-mono-data">3 gaps detected</Badge>
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
