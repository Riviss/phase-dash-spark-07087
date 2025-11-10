import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AlgorithmsTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Picker: EQTransformer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="model-path">Model Path</Label>
              <Input
                id="model-path"
                defaultValue="/models/eqt_v2.1.onnx"
                className="font-mono-data text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model-version">Version</Label>
              <Input
                id="model-version"
                defaultValue="v2.1"
                className="font-mono-data"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="window-length">Window Length (s)</Label>
              <Input
                id="window-length"
                type="number"
                defaultValue="60"
                className="font-mono-data"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hop-size">Hop Size (s)</Label>
              <Input
                id="hop-size"
                type="number"
                defaultValue="20"
                className="font-mono-data"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="batch-size">Batch Size</Label>
              <Input
                id="batch-size"
                type="number"
                defaultValue="32"
                className="font-mono-data"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="p-threshold">P Threshold</Label>
              <Input
                id="p-threshold"
                type="number"
                step="0.01"
                defaultValue="0.3"
                className="font-mono-data"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="s-threshold">S Threshold</Label>
              <Input
                id="s-threshold"
                type="number"
                step="0.01"
                defaultValue="0.3"
                className="font-mono-data"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="aggregation">Overlap Aggregation Method</Label>
            <Select defaultValue="lse">
              <SelectTrigger id="aggregation">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="max">Max</SelectItem>
                <SelectItem value="mean">Mean</SelectItem>
                <SelectItem value="lse">Log-Sum-Exp (LSE)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lse-temp">LSE Temperature (τ)</Label>
            <Input
              id="lse-temp"
              type="number"
              step="0.1"
              defaultValue="4.0"
              className="font-mono-data"
            />
          </div>

          <Badge variant="secondary" className="text-xs">
            ONNX Runtime: GPU enabled
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Associator: SSA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="taup-model">TauP Model</Label>
            <Select defaultValue="ak135">
              <SelectTrigger id="taup-model">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ak135">ak135</SelectItem>
                <SelectItem value="iasp91">iasp91</SelectItem>
                <SelectItem value="custom">Custom Regional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grid-spacing">Grid Spacing (°)</Label>
              <Input
                id="grid-spacing"
                type="number"
                step="0.01"
                defaultValue="0.1"
                className="font-mono-data"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="depth-step">Depth Step (km)</Label>
              <Input
                id="depth-step"
                type="number"
                defaultValue="5"
                className="font-mono-data"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time-step">Time Step (s)</Label>
              <Input
                id="time-step"
                type="number"
                step="0.1"
                defaultValue="0.5"
                className="font-mono-data"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min-stations">Min Stations</Label>
              <Input
                id="min-stations"
                type="number"
                defaultValue="4"
                className="font-mono-data"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-residual">Max Residual (s)</Label>
              <Input
                id="max-residual"
                type="number"
                step="0.1"
                defaultValue="1.5"
                className="font-mono-data"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight-p">P Phase Weight</Label>
              <Input
                id="weight-p"
                type="number"
                step="0.1"
                defaultValue="1.0"
                className="font-mono-data"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight-s">S Phase Weight</Label>
              <Input
                id="weight-s"
                type="number"
                step="0.1"
                defaultValue="1.2"
                className="font-mono-data"
              />
            </div>
          </div>

          <Button variant="outline" size="sm">
            Test with Fixture Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlgorithmsTab;
