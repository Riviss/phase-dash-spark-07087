// Live view types

/**
 * Real-time station status for live monitoring
 * @example
 * {
 *   id: "CI.PAS",
 *   network: "CI",
 *   code: "PAS",
 *   status: "online",
 *   latencyMs: 250,
 *   lastPacketTime: "2024-01-15T10:30:45.000Z",
 *   currentAmplitude: 1024,
 *   channels: [
 *     { code: "HHZ", sampleRate: 100, currentValue: 1024, amplitude: 512 },
 *     { code: "HHN", sampleRate: 100, currentValue: -256, amplitude: 480 },
 *     { code: "HHE", sampleRate: 100, currentValue: 128, amplitude: 495 }
 *   ]
 * }
 */
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

/**
 * Real-time channel data
 * @example
 * {
 *   code: "HHZ",
 *   sampleRate: 100,
 *   currentValue: 1024,
 *   amplitude: 512
 * }
 */
export interface LiveChannel {
  code: string;
  sampleRate: number;
  currentValue: number;
  amplitude: number;
}

/**
 * Event detection hotspot for timeline visualization
 * @example
 * {
 *   timestamp: "2024-01-15T10:30:15.000Z",
 *   brightness: 0.85,
 *   eventId: "ci40123456"
 * }
 */
export interface HotspotData {
  timestamp: string;
  brightness: number; // 0-1, event probability/intensity
  eventId?: string;
}

/**
 * Network-level status aggregation
 * @example
 * {
 *   network: "CI",
 *   stationsTotal: 150,
 *   stationsOnline: 142,
 *   averageLatency: 320
 * }
 */
export interface NetworkStatus {
  network: string;
  stationsTotal: number;
  stationsOnline: number;
  averageLatency: number;
}

/**
 * Overall system status for header display
 * @example
 * {
 *   connected: true,
 *   serverTime: "2024-01-15T10:30:45.000Z",
 *   latencyMs: 45,
 *   modelName: "EQTransformer",
 *   modelVersion: "2.1.0",
 *   stationsConnected: 142,
 *   stationsTotal: 150,
 *   eventsToday: 23,
 *   processingRate: 125.5
 * }
 */
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

/**
 * Live filter settings for real-time display
 * @example
 * {
 *   centerFreq: 5.0,
 *   bandwidth: 8.0,
 *   enabled: true
 * }
 */
export interface LiveFilterSettings {
  centerFreq: number;
  bandwidth: number;
  enabled: boolean;
}
