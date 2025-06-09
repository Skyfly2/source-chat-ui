import { Box } from "@mui/material";
import { memo } from "react";

// Import provider logos
import claudeLogo from "../../assets/claude-logo.png";
import deepseekLogo from "../../assets/deepseek-logo.png";
import geminiLogo from "../../assets/gemini-logo.png";
import grokLogo from "../../assets/grok-logo.png";
import openaiLogo from "../../assets/openai-logo.png";

interface ProviderLogoProps {
  provider: string;
  size?: number;
}

const providerLogos: { [key: string]: string } = {
  anthropic: claudeLogo,
  openai: openaiLogo,
  google: geminiLogo,
  xai: grokLogo,
  deepseek: deepseekLogo,
};

const providerColors: {
  [key: string]: { primary: string; secondary: string };
} = {
  openai: { primary: "#10A37F", secondary: "#0d8b6b" },
  anthropic: { primary: "#D2691E", secondary: "#b8561a" },
  google: { primary: "#4285F4", secondary: "#3367d6" },
  xai: { primary: "#FF6B35", secondary: "#e85d2e" },
  deepseek: { primary: "#9333EA", secondary: "#7c3aed" },
};

export const ProviderLogo = memo<ProviderLogoProps>(
  ({ provider, size = 32 }) => {
    const logoSrc = providerLogos[provider.toLowerCase()];
    const colors = providerColors[provider.toLowerCase()];

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: size,
          height: size,
          borderRadius: 1,
          background: colors
            ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
            : "linear-gradient(135deg, #6B7280 0%, #4b5563 100%)",
          padding: "4px",
          overflow: "hidden",
        }}
      >
        {logoSrc ? (
          <img
            src={logoSrc}
            alt={`${provider} logo`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              borderRadius: "2px",
            }}
          />
        ) : (
          <Box
            sx={{
              fontSize: `${size * 0.5}px`,
              color: "white",
            }}
          >
            🤖
          </Box>
        )}
      </Box>
    );
  }
);

ProviderLogo.displayName = "ProviderLogo";
