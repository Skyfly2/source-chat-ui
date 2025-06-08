import { Box, Paper, Typography } from "@mui/material";
import { memo } from "react";

interface UserMessageProps {
  content: string;
}

export const UserMessage = memo<UserMessageProps>(({ content }) => {
  return (
    <Box
      sx={{
        py: 1,
        px: 0,
        display: "flex",
        justifyContent: "flex-end",
        animation: "slideUp 0.2s ease-out",
      }}
    >
      <Box sx={{ maxWidth: { xs: "90%", sm: "80%", md: "70%" } }}>
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg, rgba(71, 85, 105, 0.4) 0%, rgba(51, 65, 85, 0.6) 100%)"
                : "linear-gradient(135deg, rgba(241, 245, 249, 0.8) 0%, rgba(226, 232, 240, 0.9) 100%)",
            color: "text.primary",
            borderRadius: 2,
            border: "1px solid",
            borderColor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(148, 163, 184, 0.15)"
                : "rgba(148, 163, 184, 0.25)",
            backdropFilter: "blur(8px)",
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 2px 8px rgba(0, 0, 0, 0.25)"
                : "0 1px 3px rgba(0, 0, 0, 0.1)",
            transform: "translateY(0)",
            transition: "all 0.15s ease-out",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 4px 12px rgba(0, 0, 0, 0.3)"
                  : "0 2px 8px rgba(0, 0, 0, 0.15)",
            },
          }}
        >
          <Typography
            variant="body1"
            sx={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              lineHeight: 1.5,
              fontSize: "0.95rem",
              fontWeight: 400,
            }}
          >
            {content}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
});

UserMessage.displayName = "UserMessage";
