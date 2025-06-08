import { useCallback, useEffect, useState } from "react";
import { api } from "../api";
import { ModelInfo } from "../types";

interface UseModelsReturn {
  models: string[];
  modelDetails: ModelInfo[];
  selectedModel: string;
  isLoading: boolean;
  error: string | null;
  setSelectedModel: (model: string) => void;
  refreshModels: () => Promise<void>;
}

export const useModels = (defaultModel?: string): UseModelsReturn => {
  const [models, setModels] = useState<string[]>([]);
  const [modelDetails, setModelDetails] = useState<ModelInfo[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>(
    defaultModel || "gpt-4o"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchModels = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await api.getModels();
      setModels(data.models);
      setModelDetails(data.modelDetails);

      // Set default model if not already set and models are available
      if (!selectedModel && data.models.length > 0) {
        setSelectedModel(data.models[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch models");
      console.error("Error fetching models:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedModel]);

  const refreshModels = useCallback(async () => {
    await fetchModels();
  }, [fetchModels]);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  return {
    models,
    modelDetails,
    selectedModel,
    isLoading,
    error,
    setSelectedModel,
    refreshModels,
  };
};
