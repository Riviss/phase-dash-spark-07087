import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { ChannelFilter } from "./TrackRow";

interface ChannelSelectorProps {
  selected: ChannelFilter;
  onSelect: (channel: ChannelFilter) => void;
}

const channelOptions: { value: ChannelFilter; label: string; shortcut: string }[] = [
  { value: "All", label: "All Channels", shortcut: "A" },
  { value: "Z", label: "Z (Vertical)", shortcut: "Z" },
  { value: "E", label: "E (East)", shortcut: "E" },
  { value: "N", label: "N (North)", shortcut: "N" },
  { value: "EN", label: "EN (Horizontal)", shortcut: "X" },
];

const ChannelSelector = ({ selected, onSelect }: ChannelSelectorProps) => {
  const currentOption = channelOptions.find((o) => o.value === selected) || channelOptions[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 gap-1.5">
          <span className="font-mono-data text-xs">Ch: {currentOption.value}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        {channelOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onSelect(option.value)}
            className="gap-2"
          >
            <span className="flex-1 font-mono-data text-xs">{option.label}</span>
            <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono-data text-[10px]">
              {option.shortcut}
            </kbd>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChannelSelector;
