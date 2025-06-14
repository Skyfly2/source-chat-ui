import type { ModelInfo } from "../types";

export const getModelDisplayName = (modelInfo: ModelInfo) => {
  const parts = modelInfo.displayName.split(": ");
  return parts.length > 1 ? parts[1] : modelInfo.displayName;
};
