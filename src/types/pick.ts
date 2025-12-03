// Phase pick types

export type PhaseType = 'P' | 'S' | 'Pg' | 'Pn' | 'Sg' | 'Sn' | 'PKP' | 'SKS';
export type PickPolarity = 'up' | 'down' | 'undetermined';
export type PickOnset = 'impulsive' | 'emergent';
export type PickSource = 'manual' | 'automatic' | 'ai';

/**
 * Individual phase pick on a waveform
 * @example
 * {
 *   id: "pick_abc123",
 *   eventId: "ci40123456",
 *   stationId: "CI.PAS",
 *   channel: "HHZ",
 *   phase: "P",
 *   time: "2024-01-15T08:22:18.450Z",
 *   position: 35.5,
 *   residual: 0.12,
 *   weight: 1,
 *   polarity: "up",
 *   onset: "impulsive",
 *   source: "ai",
 *   probability: 0.95,
 *   createdAt: "2024-01-15T08:22:45.000Z",
 *   createdBy: "eqtransformer_v2"
 * }
 */
export interface PhasePick {
  id: string;
  eventId?: string;
  stationId: string;
  channel: string;
  phase: PhaseType;
  time: string; // ISO timestamp
  position?: number; // percentage position on waveform (0-100)
  residual?: number; // seconds
  weight?: number; // 0-4
  polarity?: PickPolarity;
  onset?: PickOnset;
  source: PickSource;
  probability?: number; // 0-1 for AI picks
  createdAt: string;
  createdBy?: string;
}

/**
 * Theoretical arrival time calculated from velocity model
 * @example
 * {
 *   stationId: "CI.PAS",
 *   phase: "P",
 *   time: "2024-01-15T08:22:18.200Z",
 *   position: 34.8,
 *   distance: 45.2,
 *   takeoffAngle: 78.5,
 *   model: "iasp91"
 * }
 */
export interface TheoreticalArrival {
  stationId: string;
  phase: PhaseType;
  time: string; // ISO timestamp
  position: number; // percentage position on waveform
  distance: number; // degrees
  takeoffAngle: number; // degrees
  model: string; // e.g., "iasp91", "ak135"
}

/**
 * AI-generated probability time series for phase detection
 * @example
 * {
 *   stationId: "CI.PAS",
 *   channel: "HHZ",
 *   phase: "P",
 *   startTime: "2024-01-15T08:22:00.000Z",
 *   sampleRate: 100,
 *   values: [0.01, 0.02, 0.15, 0.85, 0.95, 0.72, ...]
 * }
 */
export interface ProbabilityData {
  stationId: string;
  channel: string;
  phase: PhaseType;
  startTime: string; // ISO timestamp
  sampleRate: number;
  values: number[]; // probability values 0-1
}

/**
 * Current pick session state
 * @example
 * {
 *   eventId: "ci40123456",
 *   picks: {
 *     "CI.PAS": [{ id: "pick_abc123", ... }],
 *     "CI.USC": [{ id: "pick_def456", ... }]
 *   },
 *   selectedPhase: "P",
 *   onePickMode: true,
 *   threshold: 0.5
 * }
 */
export interface PickSession {
  eventId: string;
  picks: Record<string, PhasePick[]>; // keyed by stationId
  selectedPhase: PhaseType;
  onePickMode: boolean;
  threshold: number;
}
