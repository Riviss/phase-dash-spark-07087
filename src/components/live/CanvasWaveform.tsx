import { useRef, useEffect, useCallback } from "react";

interface CanvasWaveformProps {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
}

const CanvasWaveform = ({
  data,
  width = 200,
  height = 48,
  className,
}: CanvasWaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    // Set canvas size accounting for device pixel ratio
    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      ctx.scale(dpr, dpr);
    }

    // Clear canvas
    ctx.clearRect(0, 0, displayWidth, displayHeight);

    if (data.length === 0) return;

    // Get CSS variable color
    const computedStyle = getComputedStyle(canvas);
    const waveformColor = computedStyle.getPropertyValue("--waveform").trim();
    ctx.strokeStyle = waveformColor ? `hsl(${waveformColor})` : "hsl(160, 60%, 45%)";
    ctx.lineWidth = 1;

    // Find data range for normalization
    const max = Math.max(...data.map(Math.abs)) || 1;

    // Draw waveform
    ctx.beginPath();
    const stepX = displayWidth / (data.length - 1);
    const midY = displayHeight / 2;
    const amplitude = (displayHeight / 2) * 0.9;

    for (let i = 0; i < data.length; i++) {
      const x = i * stepX;
      const y = midY - (data[i] / max) * amplitude;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();
  }, [data]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Redraw on resize
  useEffect(() => {
    const handleResize = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      animationRef.current = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: "100%", height }}
    />
  );
};

export default CanvasWaveform;
