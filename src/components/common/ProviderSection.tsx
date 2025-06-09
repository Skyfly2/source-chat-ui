import { Box, Grid, Typography } from "@mui/material";
import { memo } from "react";
import { ModelInfo } from "../../types";
import { ModelCard } from "./ModelCard";
import { ProviderLogo } from "./ProviderLogo";

interface ProviderSectionProps {
  provider: string;
  models: ModelInfo[];
  selectedModel: string;
  onModelSelect: (modelName: string) => void;
}

export const ProviderSection = memo<ProviderSectionProps>(
  ({ provider, models, selectedModel, onModelSelect }) => {
    return (
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 2,
          }}
        >
          <ProviderLogo provider={provider} size={32} />
          <Typography
            variant="h6"
            sx={{
              fontSize: "1.1rem",
              fontWeight: 600,
              textTransform: "capitalize",
              color: "text.primary",
              letterSpacing: "-0.02em",
              fontFamily: '"Manrope", "Inter", sans-serif',
            }}
          >
            {provider}
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {models.map((modelInfo) => (
            <Grid item xs={12} sm={6} md={4} key={modelInfo.name}>
              <ModelCard
                modelInfo={modelInfo}
                isSelected={selectedModel === modelInfo.name}
                onSelect={onModelSelect}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }
);

ProviderSection.displayName = "ProviderSection";
