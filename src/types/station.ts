// Station-related types

export type StationStatus = 'online' | 'offline' | 'degraded' | 'maintenance';

/**
 * Represents a seismic monitoring station
 * @example
 * {
 *   id: "CI.PAS",
 *   network: "CI",
 *   code: "PAS",
 *   name: "Pasadena",
 *   latitude: 34.1483,
 *   longitude: -118.1711,
 *   elevation: 257.0,
 *   status: "online",
 *   channels: ["HHZ", "HHN", "HHE"],
 *   sampleRate: 100,
 *   lastDataTime: "2024-01-15T10:30:00.000Z",
 *   latencyMs: 250
 * }
 */
export interface Station {
  id: string;
  network: string;
  code: string;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  status: StationStatus;
  channels: string[];
  sampleRate: number;
  lastDataTime: string; // ISO timestamp
  latencyMs: number;
}

/**
 * Health metrics for a station
 * @example
 * {
 *   stationId: "CI.PAS",
 *   cpuPercent: 45.2,
 *   memoryPercent: 62.8,
 *   diskPercent: 35.1,
 *   temperature: 42.5,
 *   uptime: 2592000,
 *   lastHeartbeat: "2024-01-15T10:30:00.000Z"
 * }
 */
export interface StationHealth {
  stationId: string;
  cpuPercent: number;
  memoryPercent: number;
  diskPercent: number;
  temperature: number;
  uptime: number; // seconds
  lastHeartbeat: string; // ISO timestamp
}

/**
 * Individual channel configuration for a station
 * @example
 * {
 *   id: "CI.PAS.HHZ",
 *   stationId: "CI.PAS",
 *   code: "HHZ",
 *   sampleRate: 100,
 *   gain: 629145000,
 *   units: "counts"
 * }
 */
export interface StationChannel {
  id: string;
  stationId: string;
  code: string; // e.g., "HHZ", "HHN", "HHE"
  sampleRate: number;
  gain: number;
  units: string;
}
