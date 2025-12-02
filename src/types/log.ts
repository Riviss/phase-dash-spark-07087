// Log types

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type LogComponent = 'ingestion' | 'picker' | 'associator' | 'locator' | 'api' | 'database' | 'notification' | 'system';

export interface LogEntry {
  id: string;
  timestamp: string; // ISO timestamp
  level: LogLevel;
  component: LogComponent;
  message: string;
  details?: Record<string, unknown>;
  stationId?: string;
  eventId?: string;
  userId?: string;
  traceId?: string;
}

export interface LogFilter {
  startTime?: string;
  endTime?: string;
  levels?: LogLevel[];
  components?: LogComponent[];
  search?: string;
  stationId?: string;
  eventId?: string;
  limit?: number;
  offset?: number;
}

export interface LogStats {
  totalCount: number;
  byLevel: Record<LogLevel, number>;
  byComponent: Record<LogComponent, number>;
  errorRate: number; // errors per minute
}
