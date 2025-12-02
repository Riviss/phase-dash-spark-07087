import { Activity, ChevronDown, Command, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAreas } from "@/contexts/AreaContext";

const TopBar = () => {
  const navigate = useNavigate();
  const { areas, selectedAreaId, selectedArea, setSelectedAreaId } = useAreas();

  const handleCommandPalette = () => {
    console.log("Command palette");
  };

  const handleManageAreas = () => {
    navigate("/setup?tab=areas");
  };

  return (
    <header className="flex h-12 items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold">Phase Picker DAW</span>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              <span className="font-mono-data">
                {selectedArea?.name || "Select Area"}
              </span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {areas.map((area) => (
              <DropdownMenuItem
                key={area.id}
                onClick={() => setSelectedAreaId(area.id)}
                className={selectedAreaId === area.id ? "bg-accent" : ""}
              >
                <span className="font-mono-data">{area.name}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleManageAreas}>
              Manage Areas...
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCommandPalette}
          className="gap-2 text-xs"
        >
          <Command className="h-3 w-3" />
          <span className="hidden md:inline">⇧⌘P</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopBar;
