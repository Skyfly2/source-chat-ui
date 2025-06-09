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
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 3,
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.98) 100%)"
                : "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%)",
            backdropFilter: "blur(20px)",
            border: "1px solid",
            borderColor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(148, 163, 184, 0.1)"
                : "rgba(148, 163, 184, 0.15)",
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
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
                fontSize: "1.3rem",
                letterSpacing: "-0.025em",
                fontFamily: '"Manrope", "Inter", sans-serif',
              }}
            >
              Choose AI Model
            </Typography>
            <IconButton
              onClick={onClose}
              size="small"
              sx={{ color: "text.secondary" }}
            >
              ✕
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
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
