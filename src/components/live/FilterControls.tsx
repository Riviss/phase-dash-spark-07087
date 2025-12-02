import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FilterSettings } from "@/hooks/useAudioFilter";

interface FilterControlsProps {
  settings: FilterSettings;
  onChange: (settings: FilterSettings) => void;
}

const FilterControls = ({ settings, onChange }: FilterControlsProps) => {
  const lowFreq = Math.max(0, settings.centerFreq - settings.bandwidth);
  const highFreq = settings.centerFreq + settings.bandwidth;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Switch
          id="filter-enabled"
          checked={settings.enabled}
          onCheckedChange={(enabled) => onChange({ ...settings, enabled })}
        />
        <Label htmlFor="filter-enabled" className="text-xs">
          Filter
        </Label>
      </div>

      {settings.enabled && (
        <>
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground w-16">
              Center
            </Label>
            <Slider
              value={[settings.centerFreq]}
              min={1}
              max={40}
              step={0.5}
              className="w-24"
              onValueChange={([value]) =>
                onChange({ ...settings, centerFreq: value })
              }
            />
            <span className="font-mono-data text-xs w-12">
              {settings.centerFreq.toFixed(1)}Hz
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground w-8">±</Label>
            <Slider
              value={[settings.bandwidth]}
              min={0.5}
              max={20}
              step={0.5}
              className="w-20"
              onValueChange={([value]) =>
                onChange({ ...settings, bandwidth: value })
              }
            />
            <span className="font-mono-data text-xs w-10">
              {settings.bandwidth.toFixed(1)}Hz
            </span>
          </div>

          <span className="text-xs text-muted-foreground">
            ({lowFreq.toFixed(1)}-{highFreq.toFixed(1)}Hz)
          </span>
        </>
      )}
    </div>
  );
};

export default FilterControls;
