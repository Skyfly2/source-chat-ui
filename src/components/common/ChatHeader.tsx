import { Clear, Refresh } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { memo } from "react";
import { ModelInfo } from "../../types";
import { ModelSelector } from "./ModelSelector";

interface ChatHeaderProps {
  models: string[];
  modelDetails: ModelInfo[];
  selectedModel: string;
  onModelChange: (model: string) => void;
  modelsLoading: boolean;
  isStreaming: boolean;
  hasMessages: boolean;
  onRefreshModels: () => void;
  onClearMessages: () => void;
}

export const ChatHeader = memo<ChatHeaderProps>(
  ({
    models,
    modelDetails,
    selectedModel,
    onModelChange,
    modelsLoading,
    isStreaming,
    hasMessages,
    onRefreshModels,
    onClearMessages,
  }) => {
    return (
      <Box
        sx={{
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.9) 100%)"
              : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.95) 100%)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid",
          borderColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(148, 163, 184, 0.1)"
              : "rgba(148, 163, 184, 0.15)",
        }}
      >
        <Box
          sx={{
            maxWidth: {
              xs: "100%",
              sm: "100%",
              md: "90%",
              lg: "80%",
              xl: "70%",
            },
            mx: "auto",
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              py: 1.5,
              gap: 2,
            }}
          >
            <Typography
              variant="h6"
              component="h1"
              sx={{
                fontWeight: 600,
                color: "text.primary",
                fontSize: "1.1rem",
                letterSpacing: "-0.01em",
              }}
            >
              Source Chat
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ModelSelector
                models={models}
                modelDetails={modelDetails}
                selectedModel={selectedModel}
                onModelChange={onModelChange}
                disabled={modelsLoading || isStreaming}
              />

              <IconButton
                onClick={onRefreshModels}
                disabled={modelsLoading}
                size="small"
                sx={{
                  color: "text.secondary",
                  transition: "all 0.15s ease-out",
                  "&:hover": {
                    transform: "rotate(90deg)",
                    color: "primary.main",
                  },
                }}
              >
                <Refresh fontSize="small" />
              </IconButton>

              {hasMessages && (
                <IconButton
                  onClick={onClearMessages}
                  disabled={isStreaming}
                  size="small"
                  sx={{
                    color: "text.secondary",
                    transition: "all 0.15s ease-out",
                    "&:hover": {
                      color: "error.main",
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  <Clear fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
);

ChatHeader.displayName = "ChatHeader";
