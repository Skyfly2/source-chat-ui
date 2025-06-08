import { createTheme, ThemeOptions } from "@mui/material/styles";

const getDesignTokens = (mode: "light" | "dark"): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: {
            main: "#1976d2",
            light: "#42a5f5",
            dark: "#1565c0",
          },
          secondary: {
            main: "#9c27b0",
            light: "#ba68c8",
            dark: "#7b1fa2",
          },
          background: {
            default: "#fafafa",
            paper: "#ffffff",
          },
          text: {
            primary: "#212121",
            secondary: "#757575",
          },
        }
      : {
          primary: {
            main: "#90caf9",
            light: "#e3f2fd",
            dark: "#42a5f5",
          },
          secondary: {
            main: "#ce93d8",
            light: "#f3e5f5",
            dark: "#ab47bc",
          },
          background: {
            default: "#121212",
            paper: "#1e1e1e",
          },
          text: {
            primary: "#ffffff",
            secondary: "#b0b0b0",
          },
        }),
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 300,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 300,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 400,
    },
    h4: {
      fontSize: "1.5rem",
      fontWeight: 400,
    },
    h5: {
      fontSize: "1.25rem",
      fontWeight: 400,
    },
    h6: {
      fontSize: "1rem",
      fontWeight: 500,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.43,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow:
            mode === "light"
              ? "0 2px 8px rgba(0, 0, 0, 0.1)"
              : "0 2px 8px rgba(0, 0, 0, 0.3)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          borderBottom: `1px solid ${mode === "light" ? "#e0e0e0" : "#333"}`,
        },
      },
    },
  },
});

export const createAppTheme = (mode: "light" | "dark") =>
  createTheme(getDesignTokens(mode));
