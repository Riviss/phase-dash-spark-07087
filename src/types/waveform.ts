// Waveform data types

export type FilterType = 'raw' | 'bandpass' | 'highpass' | 'lowpass' | 'integration' | 'differentiation';

/**
 * Raw or processed waveform time series
 * @example
 * {
 *   stationId: "CI.PAS",
 *   channel: "HHZ",
 *   startTime: "2024-01-15T08:22:00.000Z",
 *   endTime: "2024-01-15T08:23:00.000Z",
 *   sampleRate: 100,
 *   samples: [1024, 1056, 1089, 1102, ...],
 *   units: "counts"
 * }
 */
export interface WaveformData {
  stationId: string;
  channel: string;
  startTime: string; // ISO timestamp
  endTime: string; // ISO timestamp
  sampleRate: number;
  samples: number[];
  units: string; // e.g., "counts", "m/s", "m/s²"
}

/**
 * Request parameters for waveform data
 * @example
 * {
 *   stationId: "CI.PAS",
 *   channels: ["HHZ", "HHN", "HHE"],
 *   startTime: "2024-01-15T08:22:00.000Z",
 *   endTime: "2024-01-15T08:24:00.000Z",
 *   filter: { type: "bandpass", enabled: true, lowFreq: 1, highFreq: 10, order: 4 }
 * }
 */
export interface WaveformRequest {
  stationId: string;
  channels: string[];
  startTime: string;
  endTime: string;
  filter?: FilterSettings;
}

/**
 * Filter configuration for signal processing
 * @example
 * {
 *   type: "bandpass",
 *   enabled: true,
 *   lowFreq: 1.0,
 *   highFreq: 10.0,
 *   order: 4
 * }
 */
export interface FilterSettings {
  type: FilterType;
  enabled: boolean;
  lowFreq?: number; // Hz
  highFreq?: number; // Hz
  centerFreq?: number; // Hz
  bandwidth?: number; // Hz
  order?: number;
}

/**
 * Saved filter preset
 * @example
 * {
 *   id: "teleseismic_p",
 *   name: "Teleseismic P-waves",
 *   settings: { type: "bandpass", enabled: true, lowFreq: 0.5, highFreq: 2.0, order: 4 }
 * }
 */
export interface FilterPreset {
  id: string;
  name: string;
  settings: FilterSettings;
}

/**
 * Track identifier for waveform display
 * @example
 * {
 *   id: "CI.PAS.00.HHZ",
 *   stationId: "CI.PAS",
 *   network: "CI",
 *   station: "PAS",
 *   channel: "HHZ",
 *   location: "00"
 * }
 */
export interface WaveformTrack {
  id: string;
  stationId: string;
  network: string;
  station: string;
  channel: string;
  location: string;
}

/**
 * Spectrogram frequency-time-amplitude data
 * @example
 * {
 *   stationId: "CI.PAS",
 *   channel: "HHZ",
 *   startTime: "2024-01-15T08:22:00.000Z",
 *   endTime: "2024-01-15T08:23:00.000Z",
 *   frequencies: [0.1, 0.2, 0.5, 1.0, 2.0, 5.0, 10.0, 20.0],
 *   times: [0, 1, 2, 3, ...],
 *   amplitudes: [[0.1, 0.2, ...], [0.15, 0.25, ...], ...]
 * }
 */
export interface SpectrogramData {
  stationId: string;
  channel: string;
  startTime: string;
  endTime: string;
  frequencies: number[];
  times: number[];
  amplitudes: number[][]; // 2D array [freq][time]
}
