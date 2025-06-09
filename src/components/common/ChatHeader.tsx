import { Add, Menu, Refresh } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { memo } from "react";

interface ChatHeaderProps {
  onToggleSidebar: () => void;
  currentConversationTitle?: string;
  onNewThread?: () => void;
  sidebarOpen?: boolean;
  onRefreshThreads?: () => void;
}

export const ChatHeader = memo<ChatHeaderProps>(
  ({
    onToggleSidebar,
    currentConversationTitle,
    onNewThread,
    sidebarOpen = true,
    onRefreshThreads,
  }) => {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 2, sm: 3, md: 4 },
          py: 2,
          gap: 2,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flex: 1,
            minWidth: 0,
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
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
            }}
          >
            {currentConversationTitle || "New Thread"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Debug Refresh Button */}
          {onRefreshThreads && (
            <IconButton
              onClick={onRefreshThreads}
              size="small"
              sx={{
                color: "text.secondary",
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
              <Refresh fontSize="small" />
            </IconButton>
          )}

          {/* New Thread Button - only show when sidebar is closed */}
          {!sidebarOpen && onNewThread && (
            <IconButton
              onClick={onNewThread}
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
              <Add fontSize="medium" />
            </IconButton>
          )}
        </Box>
      </Box>
    );
  }
);

ChatHeader.displayName = "ChatHeader";
