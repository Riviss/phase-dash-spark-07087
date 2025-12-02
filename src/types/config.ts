// Configuration types for Setup

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

export interface AlgorithmConfig {
  id: string;
  areaId: string;
  type: AlgorithmType;
  name: string;
  enabled: boolean;
  parameters: Record<string, number | string | boolean>;
}

export interface PickerConfig extends AlgorithmConfig {
  type: 'picker';
  parameters: {
    model: string;
    pThreshold: number;
    sThreshold: number;
    minPeakDistance: number;
    batchSize: number;
    windowSize: number;
  };
}

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

export interface AreaConfig {
  areaId: string;
  dataSource: DataSourceConfig;
  algorithms: AlgorithmConfig[];
  pipeline: PipelineConfig;
}
