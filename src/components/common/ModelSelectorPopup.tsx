import { Box } from "@mui/material";
import { memo, useState } from "react";
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
    const [open, setOpen] = useState(false);

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
      setOpen(false);
    };

    const selectedModelInfo = getSelectedModelInfo();
    const modelGroups = groupModelsByProvider();

    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <ModelSelectorButton
            selectedModel={selectedModel}
            selectedModelInfo={selectedModelInfo}
            disabled={disabled}
            onClick={() => setOpen(true)}
          />
        </Box>

        <ModelSelectorDialog
          open={open}
          onClose={() => setOpen(false)}
          modelGroups={modelGroups}
          selectedModel={selectedModel}
          onModelSelect={handleModelSelect}
        />
      </Box>
    );
  }
);

ModelSelectorPopup.displayName = "ModelSelectorPopup";
