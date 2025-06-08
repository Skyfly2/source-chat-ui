import { useUser } from "@clerk/clerk-react";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { SignInButton, UserButton } from "../auth";

export const Header: React.FC = () => {
  const { mode, toggleMode } = useTheme();
  const { isSignedIn } = useUser();

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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={toggleMode}
            color="inherit"
            aria-label="toggle theme"
          >
            {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          {isSignedIn ? <UserButton /> : <SignInButton />}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
