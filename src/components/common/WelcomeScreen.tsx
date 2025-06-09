import { Box, Fade, Typography } from "@mui/material";
import { memo } from "react";

interface WelcomeScreenProps {
  show: boolean;
}

export const WelcomeScreen = memo<WelcomeScreenProps>(({ show }) => {
  if (!show) return null;

  return (
    <Fade in={show} timeout={600}>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 3,
          py: 6,
          px: { xs: 2, sm: 3, md: 4 },
          animation: "fadeIn 0.8s ease-out",
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 500,
            fontSize: { xs: "1.8rem", sm: "2rem", md: "2.2rem" },
            mb: 2,
            maxWidth: "600px",
            letterSpacing: "-0.03em",
            fontFamily: '"Manrope", "Inter", sans-serif',
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%)"
                : "linear-gradient(135deg, #0f172a 0%, #64748b 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          How can I help you today?
        </Typography>
      </Box>
    </Fade>
  );
});

WelcomeScreen.displayName = "WelcomeScreen";
