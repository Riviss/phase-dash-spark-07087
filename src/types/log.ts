// Log types

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type LogComponent = 'ingestion' | 'picker' | 'associator' | 'locator' | 'api' | 'database' | 'notification' | 'system';

/**
 * Individual log entry
 * @example
 * {
 *   id: "log_abc123",
 *   timestamp: "2024-01-15T10:30:45.123Z",
 *   level: "info",
 *   component: "picker",
 *   message: "Processed 256 windows in batch",
 *   details: { batchId: "batch_001", windowCount: 256, duration: 1.23 },
 *   stationId: "CI.PAS",
 *   eventId: null,
 *   userId: null,
 *   traceId: "trace_xyz789"
 * }
 */
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

/**
 * Log query filter parameters
 * @example
 * {
 *   startTime: "2024-01-15T00:00:00.000Z",
 *   endTime: "2024-01-15T23:59:59.999Z",
 *   levels: ["error", "warn"],
 *   components: ["picker", "associator"],
 *   search: "batch",
 *   stationId: null,
 *   eventId: null,
 *   limit: 100,
 *   offset: 0
 * }
 */
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

/**
 * Aggregated log statistics
 * @example
 * {
 *   totalCount: 15420,
 *   byLevel: { debug: 5000, info: 8000, warn: 2000, error: 400, fatal: 20 },
 *   byComponent: { picker: 5000, associator: 3000, ingestion: 4000, ... },
 *   errorRate: 2.5
 * }
 */
export interface LogStats {
  totalCount: number;
  byLevel: Record<LogLevel, number>;
  byComponent: Record<LogComponent, number>;
  errorRate: number; // errors per minute
}
