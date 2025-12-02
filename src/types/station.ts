// Station-related types

export type StationStatus = 'online' | 'offline' | 'degraded' | 'maintenance';

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

export interface StationHealth {
  stationId: string;
  cpuPercent: number;
  memoryPercent: number;
  diskPercent: number;
  temperature: number;
  uptime: number; // seconds
  lastHeartbeat: string; // ISO timestamp
}

export interface StationChannel {
  id: string;
  stationId: string;
  code: string; // e.g., "HHZ", "HHN", "HHE"
  sampleRate: number;
  gain: number;
  units: string;
}
