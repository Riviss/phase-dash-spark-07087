// Quality Control types

export type QCMetricStatus = 'good' | 'warning' | 'critical';

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

export interface QCSummary {
  totalStations: number;
  stationsOnline: number;
  stationsOffline: number;
  stationsDegraded: number;
  averageLatency: number;
  averageCompleteness: number;
  alertCount: number;
}

export interface DataGap {
  id: string;
  stationId: string;
  channel: string;
  startTime: string;
  endTime: string;
  durationSeconds: number;
  reason?: string;
}

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
