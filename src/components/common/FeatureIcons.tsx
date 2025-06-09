import {
  AttachFile,
  Code,
  Language,
  Psychology,
  RemoveRedEye,
  ViewInAr,
} from "@mui/icons-material";
import { Box, Tooltip } from "@mui/material";
import { memo } from "react";
import { ModelFeatures } from "../../types";

interface FeatureIconsProps {
  features?: ModelFeatures;
  size?: "small" | "medium";
}

const featureConfig = {
  reasoning: {
    icon: Psychology,
    label: "Advanced Reasoning",
    color: "#9333EA",
  },
  internet: {
    icon: Language,
    label: "Internet Access",
    color: "#059669",
  },
  vision: {
    icon: RemoveRedEye,
    label: "Vision/Image Analysis",
    color: "#DC2626",
  },
  attachments: {
    icon: AttachFile,
    label: "File Attachments",
    color: "#2563EB",
  },
  codeExecution: {
    icon: Code,
    label: "Code Execution",
    color: "#EA580C",
  },
  multimodal: {
    icon: ViewInAr,
    label: "Multimodal",
    color: "#7C3AED",
  },
};

export const FeatureIcons = memo<FeatureIconsProps>(
  ({ features, size = "small" }) => {
    if (!features) return null;

    const activeFeatures = Object.entries(features).filter(
      ([, enabled]) => enabled
    );

    if (activeFeatures.length === 0) return null;

    const iconSize = size === "small" ? 18 : 20;

    return (
      <Box
        sx={{
          display: "flex",
          gap: 0.5,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {activeFeatures.map(([featureKey]) => {
          const config = featureConfig[featureKey as keyof ModelFeatures];
          if (!config) return null;

          const IconComponent = config.icon;

          return (
            <Tooltip key={featureKey} title={config.label} arrow>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: iconSize + 6,
                  height: iconSize + 6,
                  borderRadius: 0.5,
                  backgroundColor: `${config.color}20`,
                  border: `1px solid ${config.color}40`,
                  transition: "all 0.15s ease-out",
                  "&:hover": {
                    backgroundColor: `${config.color}30`,
                    transform: "scale(1.1)",
                  },
                }}
              >
                <IconComponent
                  sx={{
                    fontSize: iconSize,
                    color: config.color,
                  }}
                />
              </Box>
            </Tooltip>
          );
        })}
      </Box>
    );
  }
);

FeatureIcons.displayName = "FeatureIcons";
