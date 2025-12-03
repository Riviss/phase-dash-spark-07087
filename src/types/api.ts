// API request/response types

/**
 * Paginated list response wrapper
 * @example
 * {
 *   data: [{ id: "ci40123456", ... }, { id: "ci40123457", ... }],
 *   total: 1250,
 *   page: 1,
 *   pageSize: 50,
 *   hasMore: true
 * }
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * API error structure
 * @example
 * {
 *   code: "VALIDATION_ERROR",
 *   message: "Invalid time range specified",
 *   details: { field: "startTime", reason: "must be before endTime" }
 * }
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Standard API response wrapper
 * @example
 * {
 *   success: true,
 *   data: { id: "ci40123456", ... },
 *   error: null,
 *   timestamp: "2024-01-15T10:30:45.000Z"
 * }
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: string;
}

// Request types

/**
 * Event list query parameters
 * @example
 * {
 *   startTime: "2024-01-15T00:00:00.000Z",
 *   endTime: "2024-01-15T23:59:59.999Z",
 *   minMagnitude: 2.0,
 *   maxMagnitude: null,
 *   minDepth: 0,
 *   maxDepth: 50,
 *   latMin: 32.5,
 *   latMax: 36.0,
 *   lonMin: -121.0,
 *   lonMax: -114.5,
 *   status: ["confirmed", "reviewed"],
 *   limit: 50,
 *   offset: 0,
 *   orderBy: "originTime",
 *   orderDir: "desc"
 * }
 */
export interface EventsRequest {
  startTime?: string;
  endTime?: string;
  minMagnitude?: number;
  maxMagnitude?: number;
  minDepth?: number;
  maxDepth?: number;
  latMin?: number;
  latMax?: number;
  lonMin?: number;
  lonMax?: number;
  status?: string[];
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
}

/**
 * Station list query parameters
 * @example
 * {
 *   network: "CI",
 *   status: ["online", "degraded"],
 *   latMin: 32.5,
 *   latMax: 36.0,
 *   lonMin: -121.0,
 *   lonMax: -114.5
 * }
 */
export interface StationsRequest {
  network?: string;
  status?: string[];
  latMin?: number;
  latMax?: number;
  lonMin?: number;
  lonMax?: number;
}

/**
 * Waveform stream request
 * @example
 * {
 *   stationIds: ["CI.PAS", "CI.USC", "CI.LAX"],
 *   channels: ["HHZ", "HHN", "HHE"],
 *   startTime: "2024-01-15T08:22:00.000Z",
 *   duration: 120
 * }
 */
export interface WaveformStreamRequest {
  stationIds: string[];
  channels: string[];
  startTime: string;
  duration: number; // seconds
}

/**
 * Phase picks submission payload
 * @example
 * {
 *   eventId: "ci40123456",
 *   picks: [
 *     { stationId: "CI.PAS", channel: "HHZ", phase: "P", time: "2024-01-15T08:22:18.450Z", polarity: "up", onset: "impulsive" },
 *     { stationId: "CI.PAS", channel: "HHE", phase: "S", time: "2024-01-15T08:22:25.120Z", polarity: null, onset: "emergent" }
 *   ],
 *   submittedBy: "analyst_jsmith"
 * }
 */
export interface PicksSubmission {
  eventId: string;
  picks: Array<{
    stationId: string;
    channel: string;
    phase: string;
    time: string;
    polarity?: string;
    onset?: string;
  }>;
  submittedBy: string;
}

/**
 * Event update payload
 * @example
 * {
 *   status: "confirmed",
 *   eventType: "earthquake",
 *   magnitude: 3.2,
 *   magnitudeType: "ML",
 *   reviewNotes: "Verified P and S arrivals on 12 stations"
 * }
 */
export interface EventUpdateRequest {
  status?: string;
  eventType?: string;
  magnitude?: number;
  magnitudeType?: string;
  reviewNotes?: string;
}

/**
 * AI picker catalog request (GET /api/pickers)
 * @description Fetches available AI picker programs and models
 * @example
 * // Response:
 * {
 *   programs: [
 *     { id: "eqtransformer", name: "EQTransformer", version: "2.1.0", ... },
 *     { id: "phasenet", name: "PhaseNet", version: "1.0.0", ... }
 *   ],
 *   models: {
 *     "eqtransformer": [
 *       { id: "original", name: "Original", ... },
 *       { id: "socal_finetuned", name: "SoCal Fine-tuned", ... }
 *     ],
 *     "phasenet": [
 *       { id: "base", name: "Base Model", ... }
 *     ]
 *   }
 * }
 */
export interface AIPickerCatalogRequest {
  // No parameters needed, returns full catalog
}
