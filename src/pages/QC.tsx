import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, TrendingUp } from "lucide-react";

const QC = () => {
  const mockResiduals = Array.from({ length: 20 }, (_, i) => ({
    station: `STA${i.toString().padStart(3, "0")}`,
    network: ["PQ", "XL", "EO"][i % 3],
    residual: (Math.random() - 0.5) * 2,
    picks: Math.floor(Math.random() * 50) + 10,
  })).sort((a, b) => Math.abs(b.residual) - Math.abs(a.residual));

  return (
    <div className="h-full overflow-auto p-6">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-semibold">QC & Residuals</h1>
        <p className="text-sm text-muted-foreground">
          Review pick quality and identify systematic errors
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Picks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Mean Residual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="font-mono-data text-2xl font-bold">0.08s</div>
              <Badge variant="secondary" className="text-xs">
                <TrendingUp className="mr-1 h-3 w-3" />
                Good
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Issues Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold">3</div>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Residual Leaderboard */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Residual Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockResiduals.slice(0, 10).map((item, i) => (
              <div
                key={item.station}
                className="flex items-center gap-3 rounded-md border border-border bg-card p-3 transition-colors hover:border-primary/50"
              >
                <div className="font-mono-data text-xs text-muted-foreground">
                  #{i + 1}
                </div>
                <div className="font-mono-data text-sm font-medium">
                  {item.network}.{item.station}
                </div>
                <div
                  className={`ml-auto font-mono-data text-sm ${
                    Math.abs(item.residual) > 0.5
                      ? "text-destructive"
                      : "text-foreground"
                  }`}
                >
                  {item.residual > 0 ? "+" : ""}
                  {item.residual.toFixed(3)}s
                </div>
                <div className="h-6 w-24 overflow-hidden rounded bg-muted/30">
                  <div className="h-full bg-waveform" style={{ width: "60%" }} />
                </div>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  Review
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Histograms */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Residual Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 rounded bg-muted/30" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">SNR Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 rounded bg-muted/30" />
          </CardContent>
        </Card>
      </div>

      {/* Batch Actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Batch Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button variant="outline" size="sm">
            Accept All &lt; 0.3s
          </Button>
          <Button variant="outline" size="sm">
            Re-run Associator
          </Button>
          <Button variant="outline" size="sm">
            Export to QuakeML
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default QC;
