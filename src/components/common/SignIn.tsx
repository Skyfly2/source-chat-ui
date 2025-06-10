import { SignInButton } from "@clerk/clerk-react";
import GoogleIcon from "@mui/icons-material/Google";
import { Box, Button, Paper, Typography } from "@mui/material";

export const SignIn: React.FC = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(18, 24, 32, 0.95)"
              : "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          border: "1px solid",
          borderColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(148, 163, 184, 0.1)"
              : "rgba(148, 163, 184, 0.15)",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0 8px 32px rgba(0, 0, 0, 0.4)"
              : "0 8px 32px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          maxWidth: 400,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 1,
            fontWeight: 600,
            color: "text.primary",
          }}
        >
          Welcome to Source Chat
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mb: 3,
            color: "text.secondary",
            fontSize: "0.9rem",
          }}
        >
          Sign in to start chatting with AI models
        </Typography>

        <SignInButton mode="modal">
          <Button
            fullWidth
            variant="contained"
            startIcon={<GoogleIcon />}
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 2,
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.9) 100%)"
                  : "linear-gradient(135deg, rgba(241, 245, 249, 0.8) 0%, rgba(226, 232, 240, 0.9) 100%)",
              color: "text.primary",
              fontWeight: 500,
              fontSize: "0.9rem",
              textTransform: "none",
              border: "1px solid",
              borderColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(148, 163, 184, 0.15)"
                  : "rgba(148, 163, 184, 0.2)",
              transition: "all 0.15s ease-out",
              "&:hover": {
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 1) 100%)"
                    : "linear-gradient(135deg, rgba(241, 245, 249, 0.9) 0%, rgba(226, 232, 240, 1) 100%)",
                borderColor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(148, 163, 184, 0.25)"
                    : "rgba(148, 163, 184, 0.3)",
                transform: "translateY(-1px)",
              },
            }}
          >
            Sign in with Google
          </Button>
        </SignInButton>
      </Paper>
    </Box>
  );
};
