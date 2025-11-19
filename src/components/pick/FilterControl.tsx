import { useState } from "react";
import { Filter, Plus, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FilterPreset {
  id: string;
  name: string;
  type: "none" | "highpass" | "bandpass" | "lowpass";
  lowFreq?: number;
  highFreq?: number;
}

const defaultFilters: FilterPreset[] = [
  { id: "none", name: "No Filter", type: "none" },
  { id: "hp-1", name: "Highpass 1Hz", type: "highpass", lowFreq: 1 },
  { id: "hp-2", name: "Highpass 2Hz", type: "highpass", lowFreq: 2 },
  { id: "bp-1-10", name: "Bandpass 1-10Hz", type: "bandpass", lowFreq: 1, highFreq: 10 },
  { id: "bp-2-8", name: "Bandpass 2-8Hz", type: "bandpass", lowFreq: 2, highFreq: 8 },
];

interface FilterControlProps {
  onFilterChange?: (filter: FilterPreset) => void;
}

const FilterControl = ({ onFilterChange }: FilterControlProps) => {
  const [filters, setFilters] = useState<FilterPreset[]>(defaultFilters);
  const [activeFilter, setActiveFilter] = useState<FilterPreset>(defaultFilters[0]);
  const [showDialog, setShowDialog] = useState(false);
  const [newFilter, setNewFilter] = useState<Partial<FilterPreset>>({
    type: "highpass",
    name: "",
  });

  const handleFilterSelect = (filter: FilterPreset) => {
    setActiveFilter(filter);
    onFilterChange?.(filter);
  };

  const handleCreateFilter = () => {
    if (!newFilter.name || !newFilter.type) return;

    const filter: FilterPreset = {
      id: `custom-${Date.now()}`,
      name: newFilter.name,
      type: newFilter.type as FilterPreset["type"],
      lowFreq: newFilter.lowFreq,
      highFreq: newFilter.highFreq,
    };

    setFilters([...filters, filter]);
    setActiveFilter(filter);
    onFilterChange?.(filter);
    setShowDialog(false);
    setNewFilter({ type: "highpass", name: "" });
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Filter:</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-6 gap-1.5 text-xs">
              <Filter className="h-3 w-3" />
              {activeFilter.name}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 bg-popover">
            {filters.map((filter) => (
              <DropdownMenuItem
                key={filter.id}
                onClick={() => handleFilterSelect(filter)}
                className="cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <span>{filter.name}</span>
                  {filter.id === activeFilter.id && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      Active
                    </Badge>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setShowDialog(true)}
              className="cursor-pointer"
            >
              <Plus className="h-3 w-3 mr-2" />
              New Filter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Filter</DialogTitle>
            <DialogDescription>
              Configure a new filter preset for waveform processing.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="filter-name">Filter Name</Label>
              <Input
                id="filter-name"
                placeholder="e.g., Bandpass 1-5Hz"
                value={newFilter.name || ""}
                onChange={(e) =>
                  setNewFilter({ ...newFilter, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="filter-type">Filter Type</Label>
              <Select
                value={newFilter.type}
                onValueChange={(value) =>
                  setNewFilter({ ...newFilter, type: value as FilterPreset["type"] })
                }
              >
                <SelectTrigger id="filter-type">
                  <SelectValue placeholder="Select filter type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="highpass">Highpass</SelectItem>
                  <SelectItem value="bandpass">Bandpass</SelectItem>
                  <SelectItem value="lowpass">Lowpass</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(newFilter.type === "highpass" || newFilter.type === "bandpass") && (
              <div className="grid gap-2">
                <Label htmlFor="low-freq">Low Frequency (Hz)</Label>
                <Input
                  id="low-freq"
                  type="number"
                  placeholder="e.g., 1"
                  value={newFilter.lowFreq || ""}
                  onChange={(e) =>
                    setNewFilter({ ...newFilter, lowFreq: parseFloat(e.target.value) })
                  }
                />
              </div>
            )}
            {(newFilter.type === "lowpass" || newFilter.type === "bandpass") && (
              <div className="grid gap-2">
                <Label htmlFor="high-freq">High Frequency (Hz)</Label>
                <Input
                  id="high-freq"
                  type="number"
                  placeholder="e.g., 10"
                  value={newFilter.highFreq || ""}
                  onChange={(e) =>
                    setNewFilter({ ...newFilter, highFreq: parseFloat(e.target.value) })
                  }
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFilter}>Create Filter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FilterControl;
