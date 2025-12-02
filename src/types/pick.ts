// Phase pick types

export type PhaseType = 'P' | 'S' | 'Pg' | 'Pn' | 'Sg' | 'Sn' | 'PKP' | 'SKS';
export type PickPolarity = 'up' | 'down' | 'undetermined';
export type PickOnset = 'impulsive' | 'emergent';
export type PickSource = 'manual' | 'automatic' | 'ai';

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

export interface TheoreticalArrival {
  stationId: string;
  phase: PhaseType;
  time: string; // ISO timestamp
  position: number; // percentage position on waveform
  distance: number; // degrees
  takeoffAngle: number; // degrees
  model: string; // e.g., "iasp91", "ak135"
}

export interface ProbabilityData {
  stationId: string;
  channel: string;
  phase: PhaseType;
  startTime: string; // ISO timestamp
  sampleRate: number;
  values: number[]; // probability values 0-1
}

export interface PickSession {
  eventId: string;
  picks: Record<string, PhasePick[]>; // keyed by stationId
  selectedPhase: PhaseType;
  onePickMode: boolean;
  threshold: number;
}
