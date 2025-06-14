import { Check } from "@mui/icons-material";
import { Box, Card, CardActionArea, Typography } from "@mui/material";
import { memo } from "react";
import { ModelInfo } from "../../types";
import { FeatureIcons } from "./FeatureIcons";
import { ProviderLogo } from "./ProviderLogo";

interface ModelCardProps {
  modelInfo: ModelInfo;
  isSelected: boolean;
  onSelect: (modelName: string) => void;
}

const getModelDisplayName = (modelInfo: ModelInfo) => {
  const parts = modelInfo.displayName.split(": ");
  return parts.length > 1 ? parts[1] : modelInfo.displayName;
};

export const ModelCard = memo<ModelCardProps>(
  ({ modelInfo, isSelected, onSelect }) => {
    return (
      <Card
        sx={{
          background: (theme) =>
            theme.palette.mode === "dark"
              ? isSelected
                ? "linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(79, 70, 229, 0.25) 100%)"
                : "rgba(30, 41, 59, 0.4)"
              : isSelected
              ? "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(79, 70, 229, 0.15) 100%)"
              : "rgba(255, 255, 255, 0.6)",
          border: "1px solid",
          borderColor: isSelected
            ? "primary.main"
            : (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(148, 163, 184, 0.1)"
                  : "rgba(148, 163, 184, 0.15)",
          borderRadius: 2,
          transition: "all 0.15s ease-out",
          "&:hover": {
            borderColor: "primary.light",
            transform: "translateY(-2px)",
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 8px 25px rgba(0, 0, 0, 0.3)"
                : "0 8px 25px rgba(0, 0, 0, 0.08)",
          },
        }}
      >
        <CardActionArea
          onClick={() => onSelect(modelInfo.name)}
          sx={{ p: 1.5, minHeight: 100 }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ProviderLogo provider={modelInfo.provider} size={24} />
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    color: "text.primary",
                    lineHeight: 1.2,
                    letterSpacing: "-0.015em",
                    fontFamily: '"Manrope", "Inter", sans-serif',
                  }}
                >
                  {getModelDisplayName(modelInfo)}
                </Typography>
              </Box>
              {isSelected && (
                <Check
                  sx={{
                    color: "primary.main",
                    fontSize: 18,
                    flexShrink: 0,
                  }}
                />
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                mt: "auto",
              }}
            >
              {modelInfo.features && (
                <FeatureIcons features={modelInfo.features} size="small" />
              )}
            </Box>
          </Box>
        </CardActionArea>
      </Card>
    );
  }
);

ModelCard.displayName = "ModelCard";
