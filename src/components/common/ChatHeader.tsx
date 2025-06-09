import { Menu } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { memo } from "react";

interface ChatHeaderProps {
  onToggleSidebar: () => void;
  currentConversationTitle?: string;
}

export const ChatHeader = memo<ChatHeaderProps>(
  ({ onToggleSidebar, currentConversationTitle }) => {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: { xs: 2, sm: 3, md: 4 },
          py: 2,
          gap: 2,
        }}
      >
        <IconButton
          onClick={onToggleSidebar}
          size="small"
          sx={{
            color: "text.primary",
            transition: "all 0.15s ease-out",
            "&:hover": {
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(0, 0, 0, 0.04)",
              transform: "scale(1.05)",
            },
          }}
        >
          <Menu fontSize="medium" />
        </IconButton>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "text.primary",
            fontSize: "1rem",
            letterSpacing: "-0.01em",
            maxWidth: { xs: "200px", sm: "300px", md: "400px" },
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {currentConversationTitle || "New Thread"}
        </Typography>
      </Box>
    );
  }
);

ChatHeader.displayName = "ChatHeader";
