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
          variant="h5"
          component="h1"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            color: "primary.main",
            fontSize: "1.4rem",
            letterSpacing: "-0.03em",
            fontFamily: '"Manrope", "Inter", sans-serif',
          }}
        >
          Source Chat
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
