import { Check } from "@mui/icons-material";
import { Box, Card, CardActionArea, Typography } from "@mui/material";
import { memo } from "react";
import { ModelInfo } from "../../types";

interface ModelCardProps {
  modelInfo: ModelInfo;
  isSelected: boolean;
  onSelect: (modelName: string) => void;
}

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
          sx={{ p: 2, minHeight: 100 }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  color: "text.primary",
                }}
              >
                {modelInfo.displayName}
              </Typography>
              {isSelected && (
                <Check
                  sx={{
                    color: "primary.main",
                    fontSize: 18,
                  }}
                />
              )}
            </Box>

            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontSize: "0.7rem",
                lineHeight: 1.3,
              }}
            >
              Context: {modelInfo.contextWindow.toLocaleString()} tokens
            </Typography>

            {modelInfo.supportsStreaming && (
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  px: 1,
                  py: 0.25,
                  borderRadius: 0.75,
                  background: "rgba(34, 197, 94, 0.1)",
                  border: "1px solid rgba(34, 197, 94, 0.2)",
                  alignSelf: "flex-start",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgb(34, 197, 94)",
                    fontSize: "0.65rem",
                    fontWeight: 500,
                  }}
                >
                  Streaming
                </Typography>
              </Box>
            )}
          </Box>
        </CardActionArea>
      </Card>
    );
  }
);

ModelCard.displayName = "ModelCard";
