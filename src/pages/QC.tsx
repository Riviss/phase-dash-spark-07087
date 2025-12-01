import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, TrendingUp, TrendingDown } from "lucide-react";

const QC = () => {
  // Mock aggregate statistics per station
  const stationStats = Array.from({ length: 20 }, (_, i) => ({
    station: `STA${i.toString().padStart(3, "0")}`,
    network: ["PQ", "XL", "EO"][i % 3],
    picksUsed: Math.floor(Math.random() * 200) + 50,
    absResidual: Math.random() * 0.8,
    relResidual: (Math.random() - 0.5) * 0.4,
    magResidual: (Math.random() - 0.5) * 0.6,
  })).sort((a, b) => b.absResidual - a.absResidual);

  const totalPicks = stationStats.reduce((sum, s) => sum + s.picksUsed, 0);
  const meanAbsResidual = stationStats.reduce((sum, s) => sum + s.absResidual, 0) / stationStats.length;
  const meanRelResidual = stationStats.reduce((sum, s) => sum + s.relResidual, 0) / stationStats.length;
  const meanMagResidual = stationStats.reduce((sum, s) => sum + s.magResidual, 0) / stationStats.length;

  return (
    <div className="h-full overflow-auto p-6">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-semibold">QC & Residuals</h1>
        <p className="text-sm text-muted-foreground">
          Review pick quality and identify systematic errors
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Picks Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono-data text-2xl font-bold">{totalPicks.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Mean Abs. TT Residual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="font-mono-data text-2xl font-bold">{meanAbsResidual.toFixed(3)}s</div>
              <Badge variant={meanAbsResidual < 0.3 ? "secondary" : "destructive"} className="text-xs">
                {meanAbsResidual < 0.3 ? <TrendingDown className="mr-1 h-3 w-3" /> : <TrendingUp className="mr-1 h-3 w-3" />}
                {meanAbsResidual < 0.3 ? "Good" : "High"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Mean Rel. TT Residual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="font-mono-data text-2xl font-bold">
                {meanRelResidual > 0 ? "+" : ""}{meanRelResidual.toFixed(3)}s
              </div>
              <Badge variant="secondary" className="text-xs">
                {Math.abs(meanRelResidual) < 0.1 ? "Unbiased" : meanRelResidual > 0 ? "Late" : "Early"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Mean Mag. Residual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="font-mono-data text-2xl font-bold">
                {meanMagResidual > 0 ? "+" : ""}{meanMagResidual.toFixed(2)}
              </div>
              <Badge variant="secondary" className="text-xs">
                {Math.abs(meanMagResidual) < 0.2 ? "Good" : "Check"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Station Statistics Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Station Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Station</TableHead>
                <TableHead className="text-right">Picks Used</TableHead>
                <TableHead className="text-right">Abs. TT Residual</TableHead>
                <TableHead className="text-right">Rel. TT Residual</TableHead>
                <TableHead className="text-right">Mag. Residual</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stationStats.map((stat) => (
                <TableRow key={stat.station}>
                  <TableCell className="font-mono-data font-medium">
                    {stat.network}.{stat.station}
                  </TableCell>
                  <TableCell className="font-mono-data text-right">{stat.picksUsed}</TableCell>
                  <TableCell className={`font-mono-data text-right ${stat.absResidual > 0.5 ? "text-destructive" : ""}`}>
                    {stat.absResidual.toFixed(3)}s
                  </TableCell>
                  <TableCell className="font-mono-data text-right">
                    {stat.relResidual > 0 ? "+" : ""}{stat.relResidual.toFixed(3)}s
                  </TableCell>
                  <TableCell className="font-mono-data text-right">
                    {stat.magResidual > 0 ? "+" : ""}{stat.magResidual.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">TT Residual Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 rounded bg-muted/30" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Magnitude Residual Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 rounded bg-muted/30" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QC;
