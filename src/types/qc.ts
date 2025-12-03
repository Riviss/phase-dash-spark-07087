// Quality Control types

export type QCMetricStatus = 'good' | 'warning' | 'critical';

/**
 * Individual QC metric measurement
 * @example
 * {
 *   id: "qc_abc123",
 *   stationId: "CI.PAS",
 *   channel: "HHZ",
 *   timestamp: "2024-01-15T10:30:00.000Z",
 *   metric: "noise_level",
 *   value: -115.2,
 *   unit: "dB",
 *   status: "good",
 *   threshold: { warning: -100, critical: -90 }
 * }
 */
export interface QCMetric {
  id: string;
  stationId: string;
  channel: string;
  timestamp: string; // ISO timestamp
  metric: string;
  value: number;
  unit: string;
  status: QCMetricStatus;
  threshold: {
    warning: number;
    critical: number;
  };
}

/**
 * Station-level QC summary
 * @example
 * {
 *   stationId: "CI.PAS",
 *   overallStatus: "good",
 *   dataCompleteness: 99.8,
 *   latency: 0.25,
 *   gapCount: 2,
 *   spikeCount: 0,
 *   noiseLevel: -115.2,
 *   lastUpdated: "2024-01-15T10:30:00.000Z",
 *   metrics: [{ id: "qc_abc123", ... }, ...]
 * }
 */
export interface StationQC {
  stationId: string;
  overallStatus: QCMetricStatus;
  dataCompleteness: number; // 0-100%
  latency: number; // seconds
  gapCount: number;
  spikeCount: number;
  noiseLevel: number; // dB
  lastUpdated: string;
  metrics: QCMetric[];
}

/**
 * Network-wide QC summary
 * @example
 * {
 *   totalStations: 150,
 *   stationsOnline: 142,
 *   stationsOffline: 5,
 *   stationsDegraded: 3,
 *   averageLatency: 0.35,
 *   averageCompleteness: 98.5,
 *   alertCount: 8
 * }
 */
export interface QCSummary {
  totalStations: number;
  stationsOnline: number;
  stationsOffline: number;
  stationsDegraded: number;
  averageLatency: number;
  averageCompleteness: number;
  alertCount: number;
}

/**
 * Data gap record
 * @example
 * {
 *   id: "gap_abc123",
 *   stationId: "CI.PAS",
 *   channel: "HHZ",
 *   startTime: "2024-01-15T08:15:00.000Z",
 *   endTime: "2024-01-15T08:15:30.000Z",
 *   durationSeconds: 30,
 *   reason: "Network timeout"
 * }
 */
export interface DataGap {
  id: string;
  stationId: string;
  channel: string;
  startTime: string;
  endTime: string;
  durationSeconds: number;
  reason?: string;
}

/**
 * QC alert/notification
 * @example
 * {
 *   id: "alert_abc123",
 *   stationId: "CI.PAS",
 *   channel: "HHZ",
 *   timestamp: "2024-01-15T10:30:00.000Z",
 *   type: "high_latency",
 *   severity: "warning",
 *   message: "Station latency exceeded 5 seconds",
 *   acknowledged: false,
 *   acknowledgedBy: null,
 *   acknowledgedAt: null
 * }
 */
export interface QCAlert {
  id: string;
  stationId: string;
  channel?: string;
  timestamp: string;
  type: string;
  severity: QCMetricStatus;
  message: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}
