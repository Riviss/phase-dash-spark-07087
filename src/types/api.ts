// API request/response types

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: string;
}

// Request types
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

export interface StationsRequest {
  network?: string;
  status?: string[];
  latMin?: number;
  latMax?: number;
  lonMin?: number;
  lonMax?: number;
}

export interface WaveformStreamRequest {
  stationIds: string[];
  channels: string[];
  startTime: string;
  duration: number; // seconds
}

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

export interface EventUpdateRequest {
  status?: string;
  eventType?: string;
  magnitude?: number;
  magnitudeType?: string;
  reviewNotes?: string;
}
