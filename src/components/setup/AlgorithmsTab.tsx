import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useAreas } from "@/contexts/AreaContext";
import { useAreaConfig } from "@/contexts/AreaConfigContext";
import CopyConfigDialog from "./CopyConfigDialog";

const AlgorithmsTab = () => {
  const { selectedAreaId, selectedArea } = useAreas();
  const { getConfig, updateAlgorithmConfig } = useAreaConfig();
  
  const config = getConfig(selectedAreaId).algorithms;

  const handleSave = () => {
    toast({ title: "Settings saved", description: `Algorithm settings saved for ${selectedArea?.name}` });
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
          <CardTitle className="text-lg">Picker: EQTransformer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="model-path">Model Path</Label>
              <Input
                id="model-path"
                value={config.picker.modelPath}
                onChange={(e) => updateAlgorithmConfig(selectedAreaId, "picker", { modelPath: e.target.value })}
                className="font-mono-data text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model-version">Version</Label>
              <Input
                id="model-version"
                value={config.picker.version}
                onChange={(e) => updateAlgorithmConfig(selectedAreaId, "picker", { version: e.target.value })}
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
                value={config.picker.windowLength}
                onChange={(e) => updateAlgorithmConfig(selectedAreaId, "picker", { windowLength: parseInt(e.target.value) || 60 })}
                className="font-mono-data"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hop-size">Hop Size (s)</Label>
              <Input
                id="hop-size"
                type="number"
                value={config.picker.hopSize}
                onChange={(e) => updateAlgorithmConfig(selectedAreaId, "picker", { hopSize: parseInt(e.target.value) || 20 })}
                className="font-mono-data"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="batch-size">Batch Size</Label>
              <Input
                id="batch-size"
                type="number"
                value={config.picker.batchSize}
                onChange={(e) => updateAlgorithmConfig(selectedAreaId, "picker", { batchSize: parseInt(e.target.value) || 32 })}
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
                value={config.picker.pThreshold}
                onChange={(e) => updateAlgorithmConfig(selectedAreaId, "picker", { pThreshold: parseFloat(e.target.value) || 0.3 })}
                className="font-mono-data"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="s-threshold">S Threshold</Label>
              <Input
                id="s-threshold"
                type="number"
                step="0.01"
                value={config.picker.sThreshold}
                onChange={(e) => updateAlgorithmConfig(selectedAreaId, "picker", { sThreshold: parseFloat(e.target.value) || 0.3 })}
                className="font-mono-data"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="aggregation">Overlap Aggregation Method</Label>
            <Select 
              value={config.picker.aggregation}
              onValueChange={(value) => updateAlgorithmConfig(selectedAreaId, "picker", { aggregation: value })}
            >
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
              value={config.picker.lseTemp}
              onChange={(e) => updateAlgorithmConfig(selectedAreaId, "picker", { lseTemp: parseFloat(e.target.value) || 4.0 })}
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
            <Select 
              value={config.associator.taupModel}
              onValueChange={(value) => updateAlgorithmConfig(selectedAreaId, "associator", { taupModel: value })}
            >
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
                value={config.associator.gridSpacing}
                onChange={(e) => updateAlgorithmConfig(selectedAreaId, "associator", { gridSpacing: parseFloat(e.target.value) || 0.1 })}
                className="font-mono-data"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="depth-step">Depth Step (km)</Label>
              <Input
                id="depth-step"
                type="number"
                value={config.associator.depthStep}
                onChange={(e) => updateAlgorithmConfig(selectedAreaId, "associator", { depthStep: parseInt(e.target.value) || 5 })}
                className="font-mono-data"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time-step">Time Step (s)</Label>
              <Input
                id="time-step"
                type="number"
                step="0.1"
                value={config.associator.timeStep}
                onChange={(e) => updateAlgorithmConfig(selectedAreaId, "associator", { timeStep: parseFloat(e.target.value) || 0.5 })}
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
                value={config.associator.minStations}
                onChange={(e) => updateAlgorithmConfig(selectedAreaId, "associator", { minStations: parseInt(e.target.value) || 4 })}
                className="font-mono-data"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-residual">Max Residual (s)</Label>
              <Input
                id="max-residual"
                type="number"
                step="0.1"
                value={config.associator.maxResidual}
                onChange={(e) => updateAlgorithmConfig(selectedAreaId, "associator", { maxResidual: parseFloat(e.target.value) || 1.5 })}
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
                value={config.associator.weightP}
                onChange={(e) => updateAlgorithmConfig(selectedAreaId, "associator", { weightP: parseFloat(e.target.value) || 1.0 })}
                className="font-mono-data"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight-s">S Phase Weight</Label>
              <Input
                id="weight-s"
                type="number"
                step="0.1"
                value={config.associator.weightS}
                onChange={(e) => updateAlgorithmConfig(selectedAreaId, "associator", { weightS: parseFloat(e.target.value) || 1.2 })}
                className="font-mono-data"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Test with Fixture Data
            </Button>
            <Button size="sm" onClick={handleSave}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlgorithmsTab;
