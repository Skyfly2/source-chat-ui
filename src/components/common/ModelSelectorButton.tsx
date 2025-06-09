import { ExpandMore } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { memo } from "react";
import { ModelInfo } from "../../types";
import { ProviderLogo } from "./ProviderLogo";

interface ModelSelectorButtonProps {
  selectedModel: string;
  selectedModelInfo?: ModelInfo;
  disabled?: boolean;
  onClick: () => void;
}

export const ModelSelectorButton = memo<ModelSelectorButtonProps>(
  ({ selectedModel, selectedModelInfo, disabled = false, onClick }) => {
    return (
      <Button
        onClick={onClick}
        disabled={disabled}
        endIcon={<ExpandMore />}
        sx={{
          minWidth: "auto",
          px: 1.5,
          py: 0.5,
          borderRadius: 1.5,
          textTransform: "none",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(30, 41, 59, 0.6)"
              : "rgba(241, 245, 249, 0.8)",
          border: "1px solid",
          borderColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(148, 163, 184, 0.15)"
              : "rgba(148, 163, 184, 0.2)",
          color: "text.primary",
          fontSize: "0.8rem",
          fontWeight: 500,
          transition: "all 0.15s ease-out",
          "&:hover": {
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(30, 41, 59, 0.8)"
                : "rgba(241, 245, 249, 1)",
            borderColor: "primary.main",
            transform: "translateY(-1px)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            maxWidth: "120px",
          }}
        >
          {selectedModelInfo && (
            <ProviderLogo provider={selectedModelInfo.provider} size={16} />
          )}
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.85rem",
              fontWeight: 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              letterSpacing: "-0.01em",
              fontFamily: '"Manrope", "Inter", sans-serif',
            }}
          >
            {selectedModelInfo?.displayName || selectedModel || "Select Model"}
          </Typography>
        </Box>
      </Button>
    );
  }
);

ModelSelectorButton.displayName = "ModelSelectorButton";
