import { useCallback, useEffect, useState } from "react";
import { api } from "../api";
import { useAuthContext } from "../contexts/AuthContext";
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

export const useModels = (defaultModel = "gpt-4.1-mini"): UseModelsReturn => {
  const [models, setModels] = useState<string[]>([]);
  const [modelDetails, setModelDetails] = useState<ModelInfo[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>(defaultModel);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const { isSignedIn, isLoading: authLoading } = useAuthContext();

  const fetchModels = useCallback(async () => {
    if (authLoading || !isSignedIn) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await api.getModels();
      setModels(data.models);
      setModelDetails(data.modelDetails);
      setHasFetched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch models");
    } finally {
      setIsLoading(false);
    }
  }, [authLoading, isSignedIn, isLoading, hasFetched]);

  const refreshModels = useCallback(async () => {
    setHasFetched(false); // Reset flag for manual refresh
    await fetchModels();
  }, [fetchModels]);

  // Fetch models when auth is ready
  useEffect(() => {
    if (!authLoading && isSignedIn && !hasFetched) {
      fetchModels();
    }
  }, [authLoading, isSignedIn, hasFetched, fetchModels]);

  return {
    models,
    modelDetails,
    selectedModel: selectedModel || "gpt-4.1-mini", // Fallback for display purposes
    isLoading,
    error,
    setSelectedModel,
    refreshModels,
  };
};
