import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAreas } from "@/contexts/AreaContext";
import { useAreaConfig } from "@/contexts/AreaConfigContext";

const CopyConfigDialog = () => {
  const { areas, selectedAreaId } = useAreas();
  const { copyConfigFromArea } = useAreaConfig();
  const [sourceAreaId, setSourceAreaId] = useState<string>("");
  const [sections, setSections] = useState<{
    dataSources: boolean;
    algorithms: boolean;
    pipeline: boolean;
  }>({
    dataSources: true,
    algorithms: true,
    pipeline: true,
  });
  const [isOpen, setIsOpen] = useState(false);

  const otherAreas = areas.filter((a) => a.id !== selectedAreaId);
  const selectedArea = areas.find((a) => a.id === selectedAreaId);

  const handleCopy = () => {
    if (!sourceAreaId) {
      toast({ title: "Error", description: "Please select a source area", variant: "destructive" });
      return;
    }

    const sectionsToUpdate = Object.entries(sections)
      .filter(([_, enabled]) => enabled)
      .map(([key]) => key as "dataSources" | "algorithms" | "pipeline");

    if (sectionsToUpdate.length === 0) {
      toast({ title: "Error", description: "Please select at least one section to copy", variant: "destructive" });
      return;
    }

    copyConfigFromArea(sourceAreaId, selectedAreaId, sectionsToUpdate);
    
    const sourceArea = areas.find((a) => a.id === sourceAreaId);
    toast({
      title: "Configuration copied",
      description: `Copied ${sectionsToUpdate.join(", ")} from ${sourceArea?.name} to ${selectedArea?.name}`,
    });
    setIsOpen(false);
  };

  if (otherAreas.length === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Copy className="mr-2 h-4 w-4" />
          Copy from Area
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Copy Configuration to {selectedArea?.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Source Area</Label>
            <Select value={sourceAreaId} onValueChange={setSourceAreaId}>
              <SelectTrigger>
                <SelectValue placeholder="Select source area" />
              </SelectTrigger>
              <SelectContent>
                {otherAreas.map((area) => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Sections to Copy</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="copy-datasources"
                  checked={sections.dataSources}
                  onCheckedChange={(checked) =>
                    setSections((prev) => ({ ...prev, dataSources: !!checked }))
                  }
                />
                <label htmlFor="copy-datasources" className="text-sm">
                  Data Sources (Ringserver, Historical Data, Resampling)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="copy-algorithms"
                  checked={sections.algorithms}
                  onCheckedChange={(checked) =>
                    setSections((prev) => ({ ...prev, algorithms: !!checked }))
                  }
                />
                <label htmlFor="copy-algorithms" className="text-sm">
                  Algorithms (Picker, Associator settings)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="copy-pipeline"
                  checked={sections.pipeline}
                  onCheckedChange={(checked) =>
                    setSections((prev) => ({ ...prev, pipeline: !!checked }))
                  }
                />
                <label htmlFor="copy-pipeline" className="text-sm">
                  Pipeline (Storage paths, status)
                </label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleCopy}>Copy Configuration</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CopyConfigDialog;
