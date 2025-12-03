// Seismic event types

export type EventStatus = 'automatic' | 'reviewed' | 'confirmed' | 'rejected';
export type EventType = 'earthquake' | 'explosion' | 'quarry_blast' | 'sonic_boom' | 'unknown';

/**
 * Full seismic event record
 * @example
 * {
 *   id: "ci40123456",
 *   originTime: "2024-01-15T08:22:15.340Z",
 *   latitude: 34.052,
 *   longitude: -118.243,
 *   depth: 8.5,
 *   magnitude: 3.2,
 *   magnitudeType: "ML",
 *   status: "confirmed",
 *   eventType: "earthquake",
 *   numStations: 45,
 *   numPhases: 78,
 *   rms: 0.42,
 *   gap: 62,
 *   minDistance: 5.2,
 *   maxDistance: 180.5,
 *   region: "Greater Los Angeles Area",
 *   createdAt: "2024-01-15T08:22:45.000Z",
 *   updatedAt: "2024-01-15T09:15:00.000Z",
 *   reviewedBy: "analyst_jsmith",
 *   reviewedAt: "2024-01-15T09:15:00.000Z"
 * }
 */
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

/**
 * Condensed event summary for lists
 * @example
 * {
 *   id: "ci40123456",
 *   originTime: "2024-01-15T08:22:15.340Z",
 *   magnitude: 3.2,
 *   magnitudeType: "ML",
 *   depth: 8.5,
 *   region: "Greater Los Angeles Area",
 *   status: "confirmed",
 *   numStations: 45
 * }
 */
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

/**
 * Event location with uncertainty estimates
 * @example
 * {
 *   latitude: 34.052,
 *   longitude: -118.243,
 *   depth: 8.5,
 *   uncertaintyHorizontal: 1.2,
 *   uncertaintyVertical: 2.5,
 *   method: "NonLinLoc"
 * }
 */
export interface EventLocation {
  latitude: number;
  longitude: number;
  depth: number;
  uncertaintyHorizontal: number; // km
  uncertaintyVertical: number; // km
  method: string; // e.g., "HYPOINVERSE", "NonLinLoc"
}
