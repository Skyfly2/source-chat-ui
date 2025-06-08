import { Psychology } from "@mui/icons-material";
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { memo } from "react";
import { ModelInfo } from "../../types";

interface ModelSelectorProps {
  models: string[];
  modelDetails: ModelInfo[];
  selectedModel: string;
  onModelChange: (model: string) => void;
  disabled?: boolean;
}

export const ModelSelector = memo<ModelSelectorProps>(
  ({
    models,
    modelDetails,
    selectedModel,
    onModelChange,
    disabled = false,
  }) => {
    const handleChange = (event: SelectChangeEvent) => {
      onModelChange(event.target.value);
    };

    const getModelInfo = (modelName: string): ModelInfo | undefined => {
      return modelDetails.find((detail) => detail.name === modelName);
    };

    const getProviderStyle = (provider: string) => {
      const styles: { [key: string]: { background: string; color: string } } = {
        openai: {
          background: "linear-gradient(135deg, #10A37F 0%, #0d8b6b 100%)",
          color: "white",
        },
        anthropic: {
          background: "linear-gradient(135deg, #D2691E 0%, #b8561a 100%)",
          color: "white",
        },
        google: {
          background: "linear-gradient(135deg, #4285F4 0%, #3367d6 100%)",
          color: "white",
        },
        xai: {
          background: "linear-gradient(135deg, #FF6B35 0%, #e85d2e 100%)",
          color: "white",
        },
        deepseek: {
          background: "linear-gradient(135deg, #9333EA 0%, #7c3aed 100%)",
          color: "white",
        },
      };
      return (
        styles[provider] || {
          background: "linear-gradient(135deg, #6B7280 0%, #4b5563 100%)",
          color: "white",
        }
      );
    };

    return (
      <FormControl
        size="small"
        sx={{
          minWidth: 200,
          "& .MuiInputLabel-root": {
            fontSize: "0.85rem",
            fontWeight: 500,
          },
          "& .MuiSelect-select": {
            fontSize: "0.9rem",
          },
        }}
        disabled={disabled}
      >
        <InputLabel id="model-selector-label">Model</InputLabel>
        <Select
          labelId="model-selector-label"
          value={selectedModel}
          label="Model"
          onChange={handleChange}
          sx={{
            borderRadius: 2,
            transition: "all 0.15s ease-out",
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center",
              gap: 1,
              py: 1,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(148, 163, 184, 0.2)"
                  : "rgba(148, 163, 184, 0.3)",
              transition: "all 0.15s ease-out",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "primary.light",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "primary.main",
              borderWidth: 1,
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                mt: 0.5,
                borderRadius: 2,
                border: "1px solid",
                borderColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(148, 163, 184, 0.15)"
                    : "rgba(148, 163, 184, 0.2)",
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.98) 100%)"
                    : "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%)",
                backdropFilter: "blur(12px)",
                boxShadow: (theme) =>
                  theme.palette.mode === "dark"
                    ? "0 8px 32px rgba(0, 0, 0, 0.4)"
                    : "0 8px 32px rgba(0, 0, 0, 0.12)",
                "& .MuiMenuItem-root": {
                  borderRadius: 1,
                  mx: 0.5,
                  my: 0.25,
                  transition: "all 0.15s ease-out",
                  "&:hover": {
                    background: (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(99, 102, 241, 0.15)"
                        : "rgba(99, 102, 241, 0.08)",
                    transform: "translateX(2px)",
                  },
                },
              },
            },
          }}
          renderValue={(value) => {
            const modelInfo = getModelInfo(value);
            return (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Psychology
                  sx={{
                    fontSize: 16,
                    color: "primary.main",
                    animation: "pulse 2s ease-in-out infinite",
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    fontSize: "0.9rem",
                  }}
                >
                  {modelInfo?.displayName || value}
                </Typography>
              </Box>
            );
          }}
        >
          {models.map((model) => {
            const modelInfo = getModelInfo(model);
            const providerStyle = modelInfo
              ? getProviderStyle(modelInfo.provider)
              : null;

            return (
              <MenuItem key={model} value={model}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    width: "100%",
                  }}
                >
                  <Psychology
                    sx={{
                      fontSize: 16,
                      color: "primary.main",
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        fontSize: "0.9rem",
                        lineHeight: 1.3,
                      }}
                    >
                      {modelInfo?.displayName || model}
                    </Typography>
                    {modelInfo && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          fontSize: "0.75rem",
                          lineHeight: 1.2,
                          mt: 0.25,
                          display: "block",
                        }}
                      >
                        {modelInfo.contextWindow.toLocaleString()} tokens •{" "}
                        {modelInfo.provider}
                      </Typography>
                    )}
                  </Box>
                  {modelInfo && providerStyle && (
                    <Chip
                      label={modelInfo.provider}
                      size="small"
                      sx={{
                        background: providerStyle.background,
                        color: providerStyle.color,
                        fontSize: "0.7rem",
                        fontWeight: 500,
                        height: 22,
                        borderRadius: 1.5,
                        flexShrink: 0,
                        transition: "all 0.15s ease-out",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                    />
                  )}
                </Box>
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    );
  }
);

ModelSelector.displayName = "ModelSelector";
