import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface DataSourceConfig {
  ringserverHost: string;
  ringSize: number;
  maxClients: number;
  port: number;
  ntpServer: string;
  fsPathTemplate: string;
  targetSampleRate: number;
}

export interface AlgorithmConfig {
  picker: {
    modelPath: string;
    version: string;
    windowLength: number;
    hopSize: number;
    batchSize: number;
    pThreshold: number;
    sThreshold: number;
    aggregation: string;
    lseTemp: number;
  };
  associator: {
    taupModel: string;
    gridSpacing: number;
    depthStep: number;
    timeStep: number;
    minStations: number;
    maxResidual: number;
    weightP: number;
    weightS: number;
  };
}

export interface PipelineConfig {
  probRailsPath: string;
  pipelineStatus: "running" | "stopped";
}

export interface AreaConfig {
  dataSources: DataSourceConfig;
  algorithms: AlgorithmConfig;
  pipeline: PipelineConfig;
}

const defaultDataSourceConfig: DataSourceConfig = {
  ringserverHost: "rtserve.iris.washington.edu:18000",
  ringSize: 2,
  maxClients: 10,
  port: 18000,
  ntpServer: "time.google.com",
  fsPathTemplate: "/home/pgcseiscomp/antelope/wfs/{year}/{month}/{day}/{yearmonthday}.{network}.{station}..{channel}.mseed",
  targetSampleRate: 100,
};

const defaultAlgorithmConfig: AlgorithmConfig = {
  picker: {
    modelPath: "/models/eqt_v2.1.onnx",
    version: "v2.1",
    windowLength: 60,
    hopSize: 20,
    batchSize: 32,
    pThreshold: 0.3,
    sThreshold: 0.3,
    aggregation: "lse",
    lseTemp: 4.0,
  },
  associator: {
    taupModel: "ak135",
    gridSpacing: 0.1,
    depthStep: 5,
    timeStep: 0.5,
    minStations: 4,
    maxResidual: 1.5,
    weightP: 1.0,
    weightS: 1.2,
  },
};

const defaultPipelineConfig: PipelineConfig = {
  probRailsPath: "probabilities/{YYYY}/{MM}/{DD}/{YYYYMMDD}.{network}.{station}.zarr",
  pipelineStatus: "stopped",
};

const defaultAreaConfig: AreaConfig = {
  dataSources: defaultDataSourceConfig,
  algorithms: defaultAlgorithmConfig,
  pipeline: defaultPipelineConfig,
};

interface AreaConfigContextType {
  configs: Record<string, AreaConfig>;
  getConfig: (areaId: string) => AreaConfig;
  updateDataSourceConfig: (areaId: string, config: Partial<DataSourceConfig>) => void;
  updateAlgorithmConfig: (areaId: string, section: "picker" | "associator", config: Partial<AlgorithmConfig["picker"]> | Partial<AlgorithmConfig["associator"]>) => void;
  updatePipelineConfig: (areaId: string, config: Partial<PipelineConfig>) => void;
  copyConfigFromArea: (sourceAreaId: string, targetAreaId: string, sections?: ("dataSources" | "algorithms" | "pipeline")[]) => void;
}

const AREA_CONFIG_STORAGE_KEY = "seismic-area-configs";

const AreaConfigContext = createContext<AreaConfigContextType | undefined>(undefined);

export const AreaConfigProvider = ({ children }: { children: ReactNode }) => {
  const [configs, setConfigs] = useState<Record<string, AreaConfig>>(() => {
    const stored = localStorage.getItem(AREA_CONFIG_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  });

  useEffect(() => {
    localStorage.setItem(AREA_CONFIG_STORAGE_KEY, JSON.stringify(configs));
  }, [configs]);

  const getConfig = (areaId: string): AreaConfig => {
    return configs[areaId] || { ...defaultAreaConfig };
  };

  const updateDataSourceConfig = (areaId: string, config: Partial<DataSourceConfig>) => {
    setConfigs((prev) => ({
      ...prev,
      [areaId]: {
        ...getConfig(areaId),
        dataSources: { ...getConfig(areaId).dataSources, ...config },
      },
    }));
  };

  const updateAlgorithmConfig = (
    areaId: string,
    section: "picker" | "associator",
    config: Partial<AlgorithmConfig["picker"]> | Partial<AlgorithmConfig["associator"]>
  ) => {
    setConfigs((prev) => {
      const currentConfig = getConfig(areaId);
      return {
        ...prev,
        [areaId]: {
          ...currentConfig,
          algorithms: {
            ...currentConfig.algorithms,
            [section]: { ...currentConfig.algorithms[section], ...config },
          },
        },
      };
    });
  };

  const updatePipelineConfig = (areaId: string, config: Partial<PipelineConfig>) => {
    setConfigs((prev) => ({
      ...prev,
      [areaId]: {
        ...getConfig(areaId),
        pipeline: { ...getConfig(areaId).pipeline, ...config },
      },
    }));
  };

  const copyConfigFromArea = (
    sourceAreaId: string,
    targetAreaId: string,
    sections?: ("dataSources" | "algorithms" | "pipeline")[]
  ) => {
    const sourceConfig = getConfig(sourceAreaId);
    const targetConfig = getConfig(targetAreaId);

    const sectionsToUpdate = sections || ["dataSources", "algorithms", "pipeline"];
    const newConfig = { ...targetConfig };

    sectionsToUpdate.forEach((section) => {
      newConfig[section] = JSON.parse(JSON.stringify(sourceConfig[section]));
    });

    setConfigs((prev) => ({
      ...prev,
      [targetAreaId]: newConfig,
    }));
  };

  return (
    <AreaConfigContext.Provider
      value={{
        configs,
        getConfig,
        updateDataSourceConfig,
        updateAlgorithmConfig,
        updatePipelineConfig,
        copyConfigFromArea,
      }}
    >
      {children}
    </AreaConfigContext.Provider>
  );
};

export const useAreaConfig = () => {
  const context = useContext(AreaConfigContext);
  if (!context) {
    throw new Error("useAreaConfig must be used within an AreaConfigProvider");
  }
  return context;
};
