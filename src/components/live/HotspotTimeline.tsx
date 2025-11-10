const HotspotTimeline = () => {
  // Mock brightness data
  const data = Array.from({ length: 240 }, (_, i) => ({
    time: i,
    brightness: Math.random() * 100 + Math.sin(i / 10) * 40,
  }));

  const maxBrightness = Math.max(...data.map((d) => d.brightness));

  return (
    <div className="relative h-20 w-full overflow-hidden rounded bg-muted/30">
      <div className="flex h-full items-end gap-[1px]">
        {data.map((d, i) => {
          const height = (d.brightness / maxBrightness) * 100;
          const isHotspot = d.brightness > maxBrightness * 0.7;
          
          return (
            <div
              key={i}
              className="flex-1 transition-all hover:opacity-80"
              style={{
                height: `${height}%`,
                backgroundColor: isHotspot
                  ? "hsl(var(--hotspot))"
                  : "hsl(var(--waveform))",
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default HotspotTimeline;
