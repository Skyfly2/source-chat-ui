import { useState } from "react";
import { useModelsQuery } from "../queries/models";
import { ModelInfo } from "../types";

interface UseModelsReturn {
  models: string[];
  modelDetails: ModelInfo[];
  selectedModel: string;
  isLoading: boolean;
  error: string | null;
  setSelectedModel: (model: string) => void;
  refreshModels: () => void;
}

export const useModels = (defaultModel = "gpt-4.1-mini"): UseModelsReturn => {
  const [selectedModel, setSelectedModel] = useState<string>(defaultModel);

  const { data, isLoading, error, refetch } = useModelsQuery();

  return {
    models: data?.models || [],
    modelDetails: data?.modelDetails || [],
    selectedModel: selectedModel || defaultModel,
    isLoading,
    error: error?.message || null,
    setSelectedModel,
    refreshModels: () => refetch(),
  };
};
