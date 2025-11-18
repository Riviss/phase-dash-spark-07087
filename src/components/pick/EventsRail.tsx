import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  time: string;
  magnitude: number;
  location: string;
  depth: number;
  picks: number;
}

const mockEvents: Event[] = Array.from({ length: 20 }, (_, i) => ({
  id: `event-${i}`,
  time: new Date(Date.now() - i * 3600000).toISOString(),
  magnitude: 2.5 + Math.random() * 3,
  location: ["WCSB", "Peace River", "Fox Creek", "Red Deer"][i % 4],
  depth: 2 + Math.random() * 8,
  picks: Math.floor(8 + Math.random() * 15),
}));

const EventsRail = () => {
  return (
    <aside className="flex h-full flex-col border-r border-border bg-card">
      <div className="border-b border-border px-3 py-2">
        <h3 className="text-sm font-medium">Events</h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-0.5 p-2">
          {mockEvents.map((event, index) => (
            <button
              key={event.id}
              className={cn(
                "w-full rounded-md px-2 py-2 text-left transition-colors hover:bg-accent",
                index === 0 && "bg-accent"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-mono-data text-xs">
                      M{event.magnitude.toFixed(1)}
                    </Badge>
                    <span className="font-mono-data text-xs text-muted-foreground">
                      {new Date(event.time).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {event.location}
                  </div>
                  <div className="mt-0.5 flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span>{event.depth.toFixed(1)} km</span>
                    <span>{event.picks} picks</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
};

export default EventsRail;
