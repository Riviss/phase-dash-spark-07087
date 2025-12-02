// Waveform data types

export type FilterType = 'raw' | 'bandpass' | 'highpass' | 'lowpass' | 'integration' | 'differentiation';

export interface WaveformData {
  stationId: string;
  channel: string;
  startTime: string; // ISO timestamp
  endTime: string; // ISO timestamp
  sampleRate: number;
  samples: number[];
  units: string; // e.g., "counts", "m/s", "m/s²"
}

export interface WaveformRequest {
  stationId: string;
  channels: string[];
  startTime: string;
  endTime: string;
  filter?: FilterSettings;
}

export interface FilterSettings {
  type: FilterType;
  enabled: boolean;
  lowFreq?: number; // Hz
  highFreq?: number; // Hz
  centerFreq?: number; // Hz
  bandwidth?: number; // Hz
  order?: number;
}

export interface FilterPreset {
  id: string;
  name: string;
  settings: FilterSettings;
}

export interface WaveformTrack {
  id: string;
  stationId: string;
  network: string;
  station: string;
  channel: string;
  location: string;
}

export interface SpectrogramData {
  stationId: string;
  channel: string;
  startTime: string;
  endTime: string;
  frequencies: number[];
  times: number[];
  amplitudes: number[][]; // 2D array [freq][time]
}
