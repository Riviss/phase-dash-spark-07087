import { useRef, useCallback, useEffect } from "react";

export interface FilterSettings {
  centerFreq: number;
  bandwidth: number;
  enabled: boolean;
}

export const useAudioFilter = (sampleRate: number = 100) => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    // Initialize Web Audio context
    audioCtxRef.current = new AudioContext({ sampleRate });
    filterRef.current = audioCtxRef.current.createBiquadFilter();
    analyserRef.current = audioCtxRef.current.createAnalyser();

    filterRef.current.type = "bandpass";
    filterRef.current.connect(analyserRef.current);

    return () => {
      audioCtxRef.current?.close();
    };
  }, [sampleRate]);

  const updateFilter = useCallback((settings: FilterSettings) => {
    if (!filterRef.current) return;

    const lowFreq = Math.max(0.1, settings.centerFreq - settings.bandwidth);
    const highFreq = settings.centerFreq + settings.bandwidth;
    const centerFreq = (lowFreq + highFreq) / 2;
    const Q = centerFreq / (highFreq - lowFreq);

    filterRef.current.frequency.value = centerFreq;
    filterRef.current.Q.value = Math.max(0.1, Q);
  }, []);

  // Simple IIR bandpass filter for processing data arrays
  const applyBandpassFilter = useCallback(
    (data: number[], settings: FilterSettings): number[] => {
      if (!settings.enabled) return data;

      const lowFreq = Math.max(0.1, settings.centerFreq - settings.bandwidth);
      const highFreq = Math.min(sampleRate / 2, settings.centerFreq + settings.bandwidth);

      // Butterworth bandpass coefficients (simplified 2nd order)
      const nyquist = sampleRate / 2;
      const lowNorm = lowFreq / nyquist;
      const highNorm = highFreq / nyquist;
      const bw = highNorm - lowNorm;
      const centerNorm = (lowNorm + highNorm) / 2;

      // Simple resonant bandpass
      const R = 1 - 3 * bw;
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
    },
    [sampleRate]
  );

  return {
    updateFilter,
    applyBandpassFilter,
  };
};

export default useAudioFilter;
