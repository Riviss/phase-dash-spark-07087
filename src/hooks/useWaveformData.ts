import { useMemo } from "react";
import { FilterPreset } from "@/components/pick/FilterControl";

// Generate seeded random number for reproducible waveforms
const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

// Generate mock seismic waveform data
export const generateWaveformData = (seed: number, length: number = 1000): number[] => {
  const data: number[] = [];
  let localSeed = seed;
  
  for (let i = 0; i < length; i++) {
    // Combine multiple frequencies to simulate seismic signal
    const t = i / length;
    const lowFreq = Math.sin(t * 2 * Math.PI * 2) * 0.3;
    const midFreq = Math.sin(t * 2 * Math.PI * 8) * 0.4;
    const highFreq = Math.sin(t * 2 * Math.PI * 25) * 0.2;
    const noise = (seededRandom(localSeed + i) - 0.5) * 0.2;
    
    // Add some event-like bursts
    const eventPos = 0.3 + (seed % 10) / 100;
    const eventDist = Math.abs(t - eventPos);
    const eventAmp = Math.exp(-eventDist * eventDist * 100) * 0.8;
    
    data.push(lowFreq + midFreq + highFreq + noise + eventAmp * Math.sin(t * 2 * Math.PI * 15));
  }
  
  return data;
};

// Apply IIR filter to waveform data
const applyFilter = (
  data: number[],
  filter: FilterPreset,
  sampleRate: number = 100
): number[] => {
  if (filter.type === "none") return data;
  
  const nyquist = sampleRate / 2;
  
  if (filter.type === "highpass" && filter.lowFreq) {
    // Simple highpass filter
    const rc = 1 / (2 * Math.PI * filter.lowFreq);
    const dt = 1 / sampleRate;
    const alpha = rc / (rc + dt);
    
    const filtered: number[] = new Array(data.length);
    filtered[0] = data[0];
    
    for (let i = 1; i < data.length; i++) {
      filtered[i] = alpha * (filtered[i - 1] + data[i] - data[i - 1]);
    }
    
    return filtered;
  }
  
  if (filter.type === "lowpass" && filter.highFreq) {
    // Simple lowpass filter
    const rc = 1 / (2 * Math.PI * filter.highFreq);
    const dt = 1 / sampleRate;
    const alpha = dt / (rc + dt);
    
    const filtered: number[] = new Array(data.length);
    filtered[0] = data[0];
    
    for (let i = 1; i < data.length; i++) {
      filtered[i] = filtered[i - 1] + alpha * (data[i] - filtered[i - 1]);
    }
    
    return filtered;
  }
  
  if (filter.type === "bandpass" && filter.lowFreq && filter.highFreq) {
    // Bandpass = highpass then lowpass
    const lowNorm = filter.lowFreq / nyquist;
    const highNorm = filter.highFreq / nyquist;
    const bw = highNorm - lowNorm;
    const centerNorm = (lowNorm + highNorm) / 2;
    
    // Resonant bandpass filter
    const R = Math.max(0.01, 1 - 3 * bw);
    const cosFreq = Math.cos(2 * Math.PI * centerNorm);
    const K = (1 - R * cosFreq) / (1 - R);
    
    const filtered: number[] = new Array(data.length);
    let y1 = 0, y2 = 0;
    let x1 = 0, x2 = 0;
    
    for (let i = 0; i < data.length; i++) {
      const x0 = data[i];
      const y0 = K * (x0 - x2) + 2 * R * cosFreq * y1 - R * R * y2;
      filtered[i] = y0;
      
      x2 = x1;
      x1 = x0;
      y2 = y1;
      y1 = y0;
    }
    
    return filtered;
  }
  
  return data;
};

// Normalize waveform to -1 to 1 range
const normalizeWaveform = (data: number[]): number[] => {
  const max = Math.max(...data.map(Math.abs));
  if (max === 0) return data;
  return data.map(v => v / max);
};

export const useWaveformData = (
  seed: number,
  filter: FilterPreset | null,
  length: number = 1000
) => {
  return useMemo(() => {
    const rawData = generateWaveformData(seed, length);
    
    if (!filter || filter.type === "none") {
      return normalizeWaveform(rawData);
    }
    
    const filteredData = applyFilter(rawData, filter);
    return normalizeWaveform(filteredData);
  }, [seed, filter, length]);
};

export default useWaveformData;
