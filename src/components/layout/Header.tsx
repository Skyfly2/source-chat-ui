import { Brightness4, Brightness7 } from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

export const Header: React.FC = () => {
  const { mode, toggleMode } = useTheme();

  return (
    <AppBar position="sticky" color="inherit">
      <Toolbar>
        <Typography
          variant="h6"
          component="h1"
          sx={{
            flexGrow: 1,
            fontWeight: 600,
            color: "primary.main",
          }}
        >
          T3 Clone
        </Typography>
        <Box>
          <IconButton
            onClick={toggleMode}
            color="inherit"
            aria-label="toggle theme"
          >
            {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
