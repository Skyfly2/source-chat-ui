import { createTheme, ThemeOptions } from "@mui/material/styles";

const getDesignTokens = (mode: "light" | "dark"): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: {
            main: "#4f46e5",
            light: "#6366f1",
            dark: "#3730a3",
          },
          secondary: {
            main: "#64748b",
            light: "#94a3b8",
            dark: "#475569",
          },
          background: {
            default: "#f1f5f9",
            paper: "#ffffff",
          },
          text: {
            primary: "#0f172a",
            secondary: "#64748b",
          },
        }
      : {
          primary: {
            main: "#6366f1",
            light: "#818cf8",
            dark: "#4f46e5",
          },
          secondary: {
            main: "#64748b",
            light: "#94a3b8",
            dark: "#475569",
          },
          background: {
            default: "#0f172a",
            paper: "rgba(30, 41, 59, 0.95)",
          },
          text: {
            primary: "#f1f5f9",
            secondary: "#94a3b8",
          },
          divider: "rgba(148, 163, 184, 0.1)",
        }),
  },
  typography: {
    fontFamily: '"Manrope", "Inter", "Segoe UI", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      letterSpacing: "-0.04em",
      fontFamily: '"Manrope", "Inter", sans-serif',
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 700,
      letterSpacing: "-0.03em",
      fontFamily: '"Manrope", "Inter", sans-serif',
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
      letterSpacing: "-0.025em",
      fontFamily: '"Manrope", "Inter", sans-serif',
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 600,
      letterSpacing: "-0.025em",
      fontFamily: '"Manrope", "Inter", sans-serif',
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 600,
      letterSpacing: "-0.02em",
      fontFamily: '"Manrope", "Inter", sans-serif',
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 600,
      letterSpacing: "-0.015em",
      fontFamily: '"Manrope", "Inter", sans-serif',
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
      fontWeight: 400,
      fontFamily: '"Inter", "Segoe UI", sans-serif',
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
      fontWeight: 400,
      fontFamily: '"Inter", "Segoe UI", sans-serif',
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: 1.4,
      fontWeight: 500,
      letterSpacing: "0.01em",
      fontFamily: '"Inter", "Segoe UI", sans-serif',
    },
    button: {
      fontWeight: 500,
      letterSpacing: "-0.01em",
      fontFamily: '"Manrope", "Inter", sans-serif',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "@global": {
          "@keyframes slideUp": {
            from: { opacity: 0, transform: "translateY(8px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
          "@keyframes fadeIn": {
            from: { opacity: 0 },
            to: { opacity: 1 },
          },
          "@keyframes pulse": {
            "0%, 100%": { opacity: 1 },
            "50%": { opacity: 0.6 },
          },
          "*": {
            scrollbarWidth: "thin",
            scrollbarColor:
              mode === "dark" ? "#374151 transparent" : "#e5e7eb transparent",
          },
          "*::-webkit-scrollbar": { width: "4px" },
          "*::-webkit-scrollbar-track": { background: "transparent" },
          "*::-webkit-scrollbar-thumb": {
            background: mode === "dark" ? "#374151" : "#e5e7eb",
            borderRadius: "2px",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 6,
          fontWeight: 500,
          padding: "6px 14px",
          transition: "all 0.15s ease-out",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: "all 0.15s ease-out",
        },
      },
    },
  },
});

export const createAppTheme = (mode: "light" | "dark") =>
  createTheme(getDesignTokens(mode));
