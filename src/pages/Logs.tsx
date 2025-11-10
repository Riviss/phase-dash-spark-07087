import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search } from "lucide-react";

const mockLogs = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  timestamp: new Date(Date.now() - i * 60000),
  level: ["info", "warn", "error"][Math.floor(Math.random() * 3)],
  component: ["ingest", "picker", "associator", "exporter"][Math.floor(Math.random() * 4)],
  message: [
    "Processing batch completed successfully",
    "High latency detected on ringserver connection",
    "Failed to associate event: insufficient stations",
    "Exported 15 events to QuakeML",
  ][Math.floor(Math.random() * 4)],
}));

const Logs = () => {
  return (
    <div className="h-full overflow-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-2xl font-semibold">System Logs</h1>
          <p className="text-sm text-muted-foreground">
            Monitor ingest, processing, and export activity
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export Logs
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search logs by component, level, or message..."
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 rounded-md border border-border bg-card p-3 font-mono-data text-xs"
              >
                <span className="text-muted-foreground">
                  {log.timestamp.toISOString().split("T")[1].split(".")[0]}
                </span>
                <Badge
                  variant={
                    log.level === "error"
                      ? "destructive"
                      : log.level === "warn"
                      ? "default"
                      : "secondary"
                  }
                  className="min-w-[60px] justify-center text-xs"
                >
                  {log.level.toUpperCase()}
                </Badge>
                <Badge variant="outline" className="min-w-[80px] justify-center">
                  {log.component}
                </Badge>
                <span className="flex-1">{log.message}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Logs;
