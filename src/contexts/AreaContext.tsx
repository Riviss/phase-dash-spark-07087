import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Area {
  id: string;
  name: string;
  minLat: string;
  maxLat: string;
  minLon: string;
  maxLon: string;
  networks: string[];
}

interface AreaContextType {
  areas: Area[];
  selectedAreaId: string;
  selectedArea: Area | undefined;
  setAreas: (areas: Area[]) => void;
  setSelectedAreaId: (id: string) => void;
  addArea: (area: Omit<Area, "id">) => Area | null;
  updateArea: (area: Area) => boolean;
  deleteArea: (id: string) => boolean;
  isDuplicateName: (name: string, excludeId?: string) => boolean;
}

const AREAS_STORAGE_KEY = "seismic-areas";
const SELECTED_AREA_KEY = "seismic-selected-area";

const defaultArea: Area = {
  id: "wcsb",
  name: "Western Canada Sedimentary Basin",
  minLat: "48.0",
  maxLat: "52.0",
  minLon: "-120.0",
  maxLon: "-108.0",
  networks: ["PQ", "XL", "EO"],
};

const AreaContext = createContext<AreaContextType | undefined>(undefined);

export const AreaProvider = ({ children }: { children: ReactNode }) => {
  const [areas, setAreasState] = useState<Area[]>(() => {
    const stored = localStorage.getItem(AREAS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [defaultArea];
  });

  const [selectedAreaId, setSelectedAreaIdState] = useState<string>(() => {
    return localStorage.getItem(SELECTED_AREA_KEY) || areas[0]?.id || "";
  });

  const selectedArea = areas.find((a) => a.id === selectedAreaId);

  // Persist areas to localStorage
  useEffect(() => {
    localStorage.setItem(AREAS_STORAGE_KEY, JSON.stringify(areas));
  }, [areas]);

  // Persist selected area
  useEffect(() => {
    localStorage.setItem(SELECTED_AREA_KEY, selectedAreaId);
  }, [selectedAreaId]);

  const setAreas = (newAreas: Area[]) => {
    setAreasState(newAreas);
  };

  const setSelectedAreaId = (id: string) => {
    setSelectedAreaIdState(id);
  };

  const isDuplicateName = (name: string, excludeId?: string): boolean => {
    return areas.some(
      (a) =>
        a.name.toLowerCase().trim() === name.toLowerCase().trim() &&
        a.id !== excludeId
    );
  };

  const addArea = (areaData: Omit<Area, "id">): Area | null => {
    if (!areaData.name.trim() || isDuplicateName(areaData.name)) {
      return null;
    }

    const id = areaData.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    const area: Area = { ...areaData, id: `${id}-${Date.now()}` };

    setAreasState((prev) => [...prev, area]);
    setSelectedAreaIdState(area.id);
    return area;
  };

  const updateArea = (updatedArea: Area): boolean => {
    if (
      !updatedArea.name.trim() ||
      isDuplicateName(updatedArea.name, updatedArea.id)
    ) {
      return false;
    }

    setAreasState((prev) =>
      prev.map((a) => (a.id === updatedArea.id ? updatedArea : a))
    );
    return true;
  };

  const deleteArea = (id: string): boolean => {
    if (areas.length <= 1) {
      return false;
    }

    setAreasState((prev) => {
      const filtered = prev.filter((a) => a.id !== id);
      if (selectedAreaId === id && filtered.length > 0) {
        setSelectedAreaIdState(filtered[0].id);
      }
      return filtered;
    });
    return true;
  };

  return (
    <AreaContext.Provider
      value={{
        areas,
        selectedAreaId,
        selectedArea,
        setAreas,
        setSelectedAreaId,
        addArea,
        updateArea,
        deleteArea,
        isDuplicateName,
      }}
    >
      {children}
    </AreaContext.Provider>
  );
};

export const useAreas = () => {
  const context = useContext(AreaContext);
  if (!context) {
    throw new Error("useAreas must be used within an AreaProvider");
  }
  return context;
};

export { AREAS_STORAGE_KEY, SELECTED_AREA_KEY };
