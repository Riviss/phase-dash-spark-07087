import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const shortcuts = [
  { category: "Transport", keys: ["Space"], action: "Play/Pause" },
  { category: "Transport", keys: ["J"], action: "Shuttle backward" },
  { category: "Transport", keys: ["K"], action: "Hold/Stop" },
  { category: "Transport", keys: ["L"], action: "Shuttle forward" },
  { category: "Transport", keys: ["I"], action: "Set loop in" },
  { category: "Transport", keys: ["O"], action: "Set loop out" },
  { category: "Navigation", keys: [";"], action: "Jump to previous peak" },
  { category: "Navigation", keys: ["'"], action: "Jump to next peak" },
  { category: "Picking", keys: ["P"], action: "Drop P phase pick" },
  { category: "Picking", keys: ["S"], action: "Drop S phase pick" },
  { category: "Picking", keys: ["↑"], action: "Toggle tool up" },
  { category: "Picking", keys: ["↓"], action: "Toggle tool down" },
  { category: "Picking", keys: ["Alt", "Drag"], action: "Micro-nudge pick" },
  { category: "Picking", keys: ["Backspace"], action: "Delete pick" },
  { category: "View", keys: ["Z"], action: "Zoom box" },
  { category: "View", keys: ["Shift", "Z"], action: "Zoom out" },
  { category: "View", keys: ["Cmd/Ctrl", "Wheel"], action: "Fine zoom" },
  { category: "Global", keys: ["⇧⌘P"], action: "Command palette" },
  { category: "Global", keys: ["G"], action: "Toggle snap mode" },
];

const Help = () => {
  return (
    <div className="h-full overflow-auto p-6">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-semibold">Keyboard Shortcuts</h1>
        <p className="text-sm text-muted-foreground">
          Learn keyboard-first workflows for maximum efficiency
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {["Transport", "Navigation", "Picking", "View", "Global"].map((category) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="text-lg">{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {shortcuts
                  .filter((s) => s.category === category)
                  .map((shortcut, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-4"
                    >
                      <span className="text-sm">{shortcut.action}</span>
                      <div className="flex gap-1">
                        {shortcut.keys.map((key, j) => (
                          <Badge
                            key={j}
                            variant="outline"
                            className="min-w-[40px] justify-center font-mono-data"
                          >
                            {key}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Tips & Workflows</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <div className="font-medium">One-sweep picking</div>
            <p className="text-muted-foreground">
              Press <Badge variant="outline" className="mx-1 font-mono-data">P</Badge> or{" "}
              <Badge variant="outline" className="mx-1 font-mono-data">S</Badge> to drop a pick at the
              cursor. Picks automatically snap to the nearest probability peak for fast, accurate
              workflow.
            </p>
          </div>
          <div>
            <div className="font-medium">Shuttle navigation</div>
            <p className="text-muted-foreground">
              Use <Badge variant="outline" className="mx-1 font-mono-data">J</Badge> and{" "}
              <Badge variant="outline" className="mx-1 font-mono-data">L</Badge> for variable-speed
              scrubbing. Hold <Badge variant="outline" className="mx-1 font-mono-data">K</Badge> to pause
              at the current frame.
            </p>
          </div>
          <div>
            <div className="font-medium">Hotspot navigation</div>
            <p className="text-muted-foreground">
              Press <Badge variant="outline" className="mx-1 font-mono-data">;</Badge> and{" "}
              <Badge variant="outline" className="mx-1 font-mono-data">'</Badge> to jump between high-probability
              peaks across all stations for rapid event review.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Help;
