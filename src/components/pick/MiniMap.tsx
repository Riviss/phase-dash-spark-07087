import { useRef, useEffect } from "react";

interface MiniMapProps {
  eventLat?: number;
  eventLon?: number;
  stationLat?: number;
  stationLon?: number;
  className?: string;
}

const MiniMap = ({
  eventLat = 51.5,
  eventLon = -114.5,
  stationLat = 51.8,
  stationLon = -114.2,
  className,
}: MiniMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = canvas.clientWidth;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    // Get CSS colors
    const computedStyle = getComputedStyle(canvas);
    const mutedColor = computedStyle.getPropertyValue("--muted").trim();
    const primaryColor = computedStyle.getPropertyValue("--primary").trim();
    const foregroundColor = computedStyle.getPropertyValue("--foreground").trim();

    // Draw background
    ctx.fillStyle = mutedColor ? `hsl(${mutedColor} / 0.3)` : "hsl(210 20% 14%)";
    ctx.fillRect(0, 0, size, size);

    // Simple grid
    ctx.strokeStyle = mutedColor ? `hsl(${mutedColor} / 0.4)` : "hsl(210 20% 25%)";
    ctx.lineWidth = 0.5;
    const gridSize = size / 8;
    for (let i = 1; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(i * gridSize, 0);
      ctx.lineTo(i * gridSize, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * gridSize);
      ctx.lineTo(size, i * gridSize);
      ctx.stroke();
    }

    // Calculate positions (simple projection centered on event)
    const centerLat = (eventLat + stationLat) / 2;
    const centerLon = (eventLon + stationLon) / 2;
    const scale = size / 2;

    const toCanvas = (lat: number, lon: number) => {
      const x = size / 2 + (lon - centerLon) * scale * 0.8;
      const y = size / 2 - (lat - centerLat) * scale * 0.8;
      return { x, y };
    };

    const eventPos = toCanvas(eventLat, eventLon);
    const stationPos = toCanvas(stationLat, stationLon);

    // Draw line between event and station
    ctx.strokeStyle = foregroundColor ? `hsl(${foregroundColor} / 0.3)` : "hsl(0 0% 60%)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(eventPos.x, eventPos.y);
    ctx.lineTo(stationPos.x, stationPos.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw event (star shape)
    ctx.fillStyle = primaryColor ? `hsl(${primaryColor})` : "hsl(0 70% 55%)";
    const drawStar = (cx: number, cy: number, r: number) => {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    };
    drawStar(eventPos.x, eventPos.y, 8);

    // Draw station (triangle)
    ctx.fillStyle = foregroundColor ? `hsl(${foregroundColor})` : "hsl(0 0% 80%)";
    ctx.beginPath();
    ctx.moveTo(stationPos.x, stationPos.y - 6);
    ctx.lineTo(stationPos.x - 5, stationPos.y + 4);
    ctx.lineTo(stationPos.x + 5, stationPos.y + 4);
    ctx.closePath();
    ctx.fill();

    // Labels
    ctx.fillStyle = foregroundColor ? `hsl(${foregroundColor} / 0.7)` : "hsl(0 0% 70%)";
    ctx.font = "9px monospace";
    ctx.textAlign = "center";
    ctx.fillText("Event", eventPos.x, eventPos.y + 16);
    ctx.fillText("Station", stationPos.x, stationPos.y + 16);
  }, [eventLat, eventLon, stationLat, stationLon]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", aspectRatio: "1" }}
    />
  );
};

export default MiniMap;
