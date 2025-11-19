import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export type PhaseType = "P" | "S";

interface PhasePickerProps {
  selectedPhase: PhaseType;
  onPhaseSelect: (phase: PhaseType) => void;
}

const phaseConfig = {
  P: { label: "P Phase", color: "hsl(var(--rail-p))", shortcut: "1" },
  S: { label: "S Phase", color: "hsl(var(--rail-s))", shortcut: "2" },
};

const PhasePicker = ({ selectedPhase, onPhaseSelect }: PhasePickerProps) => {
  const currentPhase = phaseConfig[selectedPhase];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 gap-1.5">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: currentPhase.color }}
          />
          <span className="font-mono-data text-xs">{currentPhase.label}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-36">
        {Object.entries(phaseConfig).map(([phase, config]) => (
          <DropdownMenuItem
            key={phase}
            onClick={() => onPhaseSelect(phase as PhaseType)}
            className="gap-2"
          >
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: config.color }}
            />
            <span className="flex-1 font-mono-data text-xs">{config.label}</span>
            <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono-data text-[10px]">
              {config.shortcut}
            </kbd>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PhasePicker;
