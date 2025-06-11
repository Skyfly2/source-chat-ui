import { Box } from "@mui/material";
import { memo } from "react";
import { useChatState } from "../../hooks/useChatState";
import { ModelInfo } from "../../types";
import { ModelSelectorButton } from "./ModelSelectorButton";
import { ModelSelectorDialog } from "./ModelSelectorDialog";

interface ModelSelectorPopupProps {
  models: string[];
  modelDetails: ModelInfo[];
  selectedModel: string;
  onModelChange: (model: string) => void;
  disabled?: boolean;
}

export const ModelSelectorPopup = memo<ModelSelectorPopupProps>(
  ({
    models,
    modelDetails,
    selectedModel,
    onModelChange,
    disabled = false,
  }) => {
    const { state, setModelSelectorOpen } = useChatState();
    const open = state.ui.modelSelectorOpen;

    const getModelInfo = (modelName: string): ModelInfo | undefined => {
      return modelDetails.find((detail) => detail.name === modelName);
    };

    const getSelectedModelInfo = () => {
      return getModelInfo(selectedModel);
    };

    const groupModelsByProvider = () => {
      const groups: { [key: string]: ModelInfo[] } = {};

      models.forEach((modelName) => {
        const modelInfo = getModelInfo(modelName);
        if (modelInfo) {
          if (!groups[modelInfo.provider]) {
            groups[modelInfo.provider] = [];
          }
          groups[modelInfo.provider].push(modelInfo);
        }
      });

      return groups;
    };

    const handleModelSelect = (modelName: string) => {
      onModelChange(modelName);
      setModelSelectorOpen(false);
    };

    const selectedModelInfo = getSelectedModelInfo();
    const modelGroups = groupModelsByProvider();

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          {selectedModelInfo && (
            <ModelSelectorButton
              selectedModelInfo={selectedModelInfo}
              disabled={disabled}
              onClick={() => setModelSelectorOpen(true)}
            />
          )}
        </Box>

        <ModelSelectorDialog
          open={open}
          onClose={() => setModelSelectorOpen(false)}
          modelGroups={modelGroups}
          selectedModel={selectedModel}
          onModelSelect={handleModelSelect}
        />
      </Box>
    );
  }
);

ModelSelectorPopup.displayName = "ModelSelectorPopup";
