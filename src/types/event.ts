// Seismic event types

export type EventStatus = 'automatic' | 'reviewed' | 'confirmed' | 'rejected';
export type EventType = 'earthquake' | 'explosion' | 'quarry_blast' | 'sonic_boom' | 'unknown';

export interface SeismicEvent {
  id: string;
  originTime: string; // ISO timestamp
  latitude: number;
  longitude: number;
  depth: number; // km
  magnitude: number;
  magnitudeType: string; // e.g., "ML", "Mw", "mb"
  status: EventStatus;
  eventType: EventType;
  numStations: number;
  numPhases: number;
  rms: number;
  gap: number; // azimuthal gap in degrees
  minDistance: number; // km
  maxDistance: number; // km
  region: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  reviewedBy?: string;
  reviewedAt?: string; // ISO timestamp
}

export interface EventSummary {
  id: string;
  originTime: string;
  magnitude: number;
  magnitudeType: string;
  depth: number;
  region: string;
  status: EventStatus;
  numStations: number;
}

export interface EventLocation {
  latitude: number;
  longitude: number;
  depth: number;
  uncertaintyHorizontal: number; // km
  uncertaintyVertical: number; // km
  method: string; // e.g., "HYPOINVERSE", "NonLinLoc"
}
