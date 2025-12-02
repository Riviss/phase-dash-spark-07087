// Live view types

export interface LiveStation {
  id: string;
  network: string;
  code: string;
  status: 'online' | 'offline' | 'degraded';
  latencyMs: number;
  lastPacketTime: string;
  currentAmplitude: number;
  channels: LiveChannel[];
}

export interface LiveChannel {
  code: string;
  sampleRate: number;
  currentValue: number;
  amplitude: number;
}

export interface HotspotData {
  timestamp: string;
  brightness: number; // 0-1, event probability/intensity
  eventId?: string;
}

export interface NetworkStatus {
  network: string;
  stationsTotal: number;
  stationsOnline: number;
  averageLatency: number;
}

export interface SystemStatus {
  connected: boolean;
  serverTime: string;
  latencyMs: number;
  modelName: string;
  modelVersion: string;
  stationsConnected: number;
  stationsTotal: number;
  eventsToday: number;
  processingRate: number; // events per second
}

export interface LiveFilterSettings {
  centerFreq: number;
  bandwidth: number;
  enabled: boolean;
}
