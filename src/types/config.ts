// Configuration types for Setup

/**
 * Geographic monitoring area definition
 * @example
 * {
 *   id: "socal",
 *   name: "Southern California",
 *   latMin: 32.5,
 *   latMax: 36.0,
 *   lonMin: -121.0,
 *   lonMax: -114.5,
 *   networks: ["CI", "AZ", "SN"],
 *   description: "Southern California Seismic Network coverage area",
 *   createdAt: "2024-01-01T00:00:00.000Z",
 *   updatedAt: "2024-01-15T10:00:00.000Z"
 * }
 */
export interface Area {
  id: string;
  name: string;
  latMin: number;
  latMax: number;
  lonMin: number;
  lonMax: number;
  networks: string[];
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type DataSourceType = 'seedlink' | 'fdsn' | 'earthworm' | 'slink' | 'file';
export type DataSourceProtocol = 'tcp' | 'http' | 'https' | 'ws' | 'wss';

/**
 * Data source connection configuration
 * @example
 * {
 *   id: "ds_scedc",
 *   areaId: "socal",
 *   name: "SCEDC SeedLink",
 *   type: "seedlink",
 *   host: "rtserve.iris.washington.edu",
 *   port: 18000,
 *   protocol: "tcp",
 *   enabled: true,
 *   networks: ["CI"],
 *   stations: ["PAS", "USC", "LAX"],
 *   channels: ["HH?", "BH?"],
 *   reconnectInterval: 30,
 *   bufferSize: 4096,
 *   timeout: 60
 * }
 */
export interface DataSourceConfig {
  id: string;
  areaId: string;
  name: string;
  type: DataSourceType;
  host: string;
  port: number;
  protocol: DataSourceProtocol;
  enabled: boolean;
  networks: string[];
  stations?: string[];
  channels?: string[];
  reconnectInterval: number; // seconds
  bufferSize: number; // samples
  timeout: number; // seconds
}

export type AlgorithmType = 'picker' | 'associator' | 'locator' | 'magnitude';

/**
 * Base algorithm configuration
 */
export interface AlgorithmConfig {
  id: string;
  areaId: string;
  type: AlgorithmType;
  name: string;
  enabled: boolean;
  parameters: Record<string, number | string | boolean>;
}

// ============= AI Picker Program & Model Types =============

/**
 * Available AI picker program from API
 * @example
 * {
 *   id: "eqtransformer",
 *   name: "EQTransformer",
 *   version: "2.1.0",
 *   description: "Deep learning model for earthquake detection and phase picking",
 *   supportedPhases: ["P", "S"],
 *   models: ["original", "socal_finetuned", "global_v2"],
 *   defaultModel: "original",
 *   inputChannels: 3,
 *   sampleRate: 100,
 *   windowSize: 6000
 * }
 */
export interface AIPickerProgram {
  id: string;
  name: string;
  version: string;
  description: string;
  supportedPhases: string[];
  models: string[];
  defaultModel: string;
  inputChannels: number;
  sampleRate: number;
  windowSize: number;
}

/**
 * AI model metadata from API
 * @example
 * {
 *   id: "socal_finetuned",
 *   programId: "eqtransformer",
 *   name: "SoCal Fine-tuned",
 *   version: "1.2.0",
 *   description: "Fine-tuned on Southern California earthquake catalog",
 *   trainedOn: "2023 Southern California catalog (M>1.5)",
 *   accuracy: { p: 0.94, s: 0.91 },
 *   createdAt: "2024-01-10T00:00:00.000Z"
 * }
 */
export interface AIPickerModel {
  id: string;
  programId: string;
  name: string;
  version: string;
  description: string;
  trainedOn?: string;
  accuracy?: { p: number; s: number };
  createdAt: string;
}

/**
 * API response for available picker programs
 * @example
 * {
 *   programs: [
 *     { id: "eqtransformer", name: "EQTransformer", ... },
 *     { id: "phasenet", name: "PhaseNet", ... },
 *     { id: "gpd", name: "Generalized Phase Detection", ... }
 *   ],
 *   models: {
 *     "eqtransformer": [{ id: "original", ... }, { id: "socal_finetuned", ... }],
 *     "phasenet": [{ id: "base", ... }]
 *   }
 * }
 */
export interface AIPickerCatalog {
  programs: AIPickerProgram[];
  models: Record<string, AIPickerModel[]>;
}

/**
 * Picker algorithm configuration
 * @example
 * {
 *   id: "picker_socal",
 *   areaId: "socal",
 *   type: "picker",
 *   name: "SoCal Picker",
 *   enabled: true,
 *   parameters: {
 *     program: "eqtransformer",
 *     model: "socal_finetuned",
 *     pThreshold: 0.3,
 *     sThreshold: 0.3,
 *     minPeakDistance: 50,
 *     batchSize: 256,
 *     windowSize: 6000
 *   }
 * }
 */
export interface PickerConfig extends AlgorithmConfig {
  type: 'picker';
  parameters: {
    program: string;      // AI picker program ID
    model: string;        // AI model ID
    pThreshold: number;
    sThreshold: number;
    minPeakDistance: number;
    batchSize: number;
    windowSize: number;
  };
}

/**
 * Associator algorithm configuration
 * @example
 * {
 *   id: "assoc_socal",
 *   areaId: "socal",
 *   type: "associator",
 *   name: "SoCal Associator",
 *   enabled: true,
 *   parameters: {
 *     method: "GSEL",
 *     minPicks: 4,
 *     maxResidual: 1.5,
 *     timeWindow: 60,
 *     distanceWeight: 0.5
 *   }
 * }
 */
export interface AssociatorConfig extends AlgorithmConfig {
  type: 'associator';
  parameters: {
    method: string;
    minPicks: number;
    maxResidual: number;
    timeWindow: number;
    distanceWeight: number;
  };
}

/**
 * Locator algorithm configuration
 * @example
 * {
 *   id: "loc_socal",
 *   areaId: "socal",
 *   type: "locator",
 *   name: "SoCal Locator",
 *   enabled: true,
 *   parameters: {
 *     method: "NonLinLoc",
 *     velocityModel: "socal3d",
 *     maxIterations: 100,
 *     convergenceThreshold: 0.001,
 *     fixedDepth: null
 *   }
 * }
 */
export interface LocatorConfig extends AlgorithmConfig {
  type: 'locator';
  parameters: {
    method: string;
    velocityModel: string;
    maxIterations: number;
    convergenceThreshold: number;
    fixedDepth?: number;
  };
}

/**
 * Magnitude algorithm configuration
 * @example
 * {
 *   id: "mag_socal",
 *   areaId: "socal",
 *   type: "magnitude",
 *   name: "SoCal Magnitude",
 *   enabled: true,
 *   parameters: {
 *     type: "ML",
 *     minStations: 4,
 *     maxDistance: 150,
 *     attenuationModel: "hutton_boore"
 *   }
 * }
 */
export interface MagnitudeConfig extends AlgorithmConfig {
  type: 'magnitude';
  parameters: {
    type: string; // "ML", "Mw", "mb"
    minStations: number;
    maxDistance: number;
    attenuationModel: string;
  };
}

export type PipelineStage = 'ingestion' | 'detection' | 'association' | 'location' | 'magnitude' | 'notification';

/**
 * Processing pipeline configuration
 * @example
 * {
 *   id: "pipe_socal",
 *   areaId: "socal",
 *   name: "SoCal Pipeline",
 *   enabled: true,
 *   stages: ["ingestion", "detection", "association", "location", "magnitude", "notification"],
 *   autoProcess: true,
 *   notifyOnEvent: true,
 *   minMagnitude: 2.0,
 *   processingDelay: 5
 * }
 */
export interface PipelineConfig {
  id: string;
  areaId: string;
  name: string;
  enabled: boolean;
  stages: PipelineStage[];
  autoProcess: boolean;
  notifyOnEvent: boolean;
  minMagnitude?: number;
  processingDelay: number; // seconds
}

/**
 * Complete area configuration bundle
 * @example
 * {
 *   areaId: "socal",
 *   dataSource: { id: "ds_scedc", ... },
 *   algorithms: [{ type: "picker", ... }, { type: "associator", ... }],
 *   pipeline: { id: "pipe_socal", ... }
 * }
 */
export interface AreaConfig {
  areaId: string;
  dataSource: DataSourceConfig;
  algorithms: AlgorithmConfig[];
  pipeline: PipelineConfig;
}
