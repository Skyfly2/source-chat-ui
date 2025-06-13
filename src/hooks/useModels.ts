import { useState } from "react";
import { useAllModelsQuery, useImportantModelsQuery } from "../queries/models";
import { ModelInfo, OpenRouterModel } from "../types";

interface UseModelsReturn {
  models: string[];
  modelDetails: ModelInfo[];
  selectedModel: string;
  isLoading: boolean;
  error: string | null;
  setSelectedModel: (model: string) => void;
  refreshModels: () => void;
}

const transformOpenRouterModelToModelInfo = (
  openRouterModel: OpenRouterModel
): ModelInfo => {
  const provider = openRouterModel.id.split("/")[0];

  // TODO: Add more features
  const features = {
    reasoning:
      provider === "openai" &&
      (openRouterModel.id.includes("o1") || openRouterModel.id.includes("o3")),
    vision: openRouterModel.architecture.input_modalities.includes("image"),
    multimodal: openRouterModel.architecture.input_modalities.length > 1,
    internet:
      openRouterModel.id.includes("search") ||
      openRouterModel.name.toLowerCase().includes("search"),
    codeExecution:
      openRouterModel.name.toLowerCase().includes("code") ||
      openRouterModel.id.includes("code"),
    attachments:
      openRouterModel.architecture.input_modalities.includes("image") ||
      openRouterModel.architecture.input_modalities.includes("audio"),
  };

  return {
    name: openRouterModel.id,
    displayName: openRouterModel.name,
    provider: provider,
    maxTokens: openRouterModel.top_provider.max_completion_tokens || 4096,
    contextWindow: openRouterModel.context_length,
    supportsStreaming: true,
    features,
  };
};

export const useImportantModels = (
  defaultModel = "openai/gpt-4o"
): UseModelsReturn => {
  const [selectedModel, setSelectedModel] = useState<string>(defaultModel);

  const { data, isLoading, error, refetch } = useImportantModelsQuery();

  const models = data?.models?.map((model) => model.id) || [];
  const modelDetails =
    data?.models?.map(transformOpenRouterModelToModelInfo) || [];

  return {
    models,
    modelDetails,
    selectedModel: selectedModel || defaultModel,
    isLoading,
    error: error?.message || null,
    setSelectedModel,
    refreshModels: () => refetch(),
  };
};

export const useAllModels = (
  defaultModel = "openai/gpt-4o"
): UseModelsReturn => {
  const [selectedModel, setSelectedModel] = useState<string>(defaultModel);

  const { data, isLoading, error, refetch } = useAllModelsQuery();

  const models = data?.models?.map((model) => model.id) || [];
  const modelDetails =
    data?.models?.map(transformOpenRouterModelToModelInfo) || [];

  return {
    models,
    modelDetails,
    selectedModel: selectedModel || defaultModel,
    isLoading,
    error: error?.message || null,
    setSelectedModel,
    refreshModels: () => refetch(),
  };
};
