import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { memo } from "react";
import { ModelInfo } from "../../types";
import { ProviderSection } from "./ProviderSection";

interface ModelSelectorDialogProps {
  open: boolean;
  onClose: () => void;
  modelGroups: { [key: string]: ModelInfo[] };
  selectedModel: string;
  onModelSelect: (modelName: string) => void;
}

export const ModelSelectorDialog = memo<ModelSelectorDialogProps>(
  ({ open, onClose, modelGroups, selectedModel, onModelSelect }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(8px)",
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(0, 0, 0, 0.6)"
                : "rgba(0, 0, 0, 0.3)",
          },
        }}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 4,
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg, #0B0E14 0%, #121820 100%)"
                : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            backdropFilter: "blur(24px)",
            border: "1px solid",
            borderColor: (theme) =>
              theme.palette.mode === "dark"
                ? "#232A35"
                : "rgba(148, 163, 184, 0.2)",
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)"
                : "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        <DialogTitle sx={{ pb: 2, pt: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                fontSize: "1.4rem",
                letterSpacing: "-0.025em",
                fontFamily: '"Manrope", "Inter", sans-serif',
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "linear-gradient(135deg, #FFFFFF 0%, #A0A0B2 100%)"
                    : "linear-gradient(135deg, #0F172A 0%, #64748B 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Choose AI Model
            </Typography>
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                color: "text.secondary",
                width: 32,
                height: 32,
                borderRadius: "50%",
                transition: "all 0.2s ease-out",
                "&:hover": {
                  backgroundColor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(148, 163, 184, 0.1)"
                      : "rgba(148, 163, 184, 0.08)",
                  color: "text.primary",
                  transform: "scale(1.1)",
                },
              }}
            >
              ✕
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 0, pb: 3, px: 3 }}>
          {Object.entries(modelGroups).map(([provider, providerModels]) => (
            <ProviderSection
              key={provider}
              provider={provider}
              models={providerModels}
              selectedModel={selectedModel}
              onModelSelect={onModelSelect}
            />
          ))}
        </DialogContent>
      </Dialog>
    );
  }
);

ModelSelectorDialog.displayName = "ModelSelectorDialog";
