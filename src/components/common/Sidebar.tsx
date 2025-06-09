import { Add, Close } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { memo } from "react";

interface ConversationThread {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  conversations?: ConversationThread[];
  currentConversationId?: string;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  isLoading?: boolean;
}

export const Sidebar = memo<SidebarProps>(
  ({
    open,
    onClose,
    conversations = [],
    currentConversationId,
    onNewChat,
    onSelectConversation,
    onDeleteConversation,
    onRenameConversation: _onRenameConversation,
    isLoading = false,
  }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const sidebarContent = (
      <Box
        sx={{
          width: 280,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 1) 100%)"
              : "linear-gradient(135deg, rgba(241, 245, 249, 0.95) 0%, rgba(226, 232, 240, 1) 100%)",
          borderRight: "1px solid",
          borderColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(148, 163, 184, 0.1)"
              : "rgba(148, 163, 184, 0.15)",
        }}
      >
        {/* Header with New Chat */}
        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            startIcon={<Add />}
            onClick={onNewChat}
            sx={{
              py: 1,
              px: 2,
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
            New Chat
          </Button>
        </Box>

        {/* Conversations List */}
        <Box sx={{ flex: 1, overflow: "hidden" }}>
          <Typography
            variant="subtitle2"
            sx={{
              px: 2,
              py: 1.5,
              color: "text.secondary",
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Recent Chats
          </Typography>

          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                py: 4,
              }}
            >
              <CircularProgress size={24} />
            </Box>
          ) : conversations.length === 0 ? (
            <Box sx={{ px: 2, py: 4 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  textAlign: "center",
                  fontSize: "0.8rem",
                }}
              >
                No conversations yet
              </Typography>
            </Box>
          ) : (
            <List sx={{ px: 1, py: 0 }}>
              {conversations.map((conversation) => (
                <ListItem key={conversation.id} disablePadding>
                  <ListItemButton
                    selected={conversation.id === currentConversationId}
                    onClick={() => onSelectConversation(conversation.id)}
                    sx={{
                      borderRadius: 1.5,
                      mx: 0.5,
                      my: 0.25,
                      transition: "all 0.15s ease-out",
                      "&.Mui-selected": {
                        background: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(148, 163, 184, 0.15)"
                            : "rgba(148, 163, 184, 0.1)",
                        "&:hover": {
                          background: (theme) =>
                            theme.palette.mode === "dark"
                              ? "rgba(148, 163, 184, 0.2)"
                              : "rgba(148, 163, 184, 0.15)",
                        },
                      },
                      "&:hover": {
                        background: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(148, 163, 184, 0.08)"
                            : "rgba(148, 163, 184, 0.05)",
                      },
                    }}
                  >
                    <ListItemText
                      primary={conversation.title}
                      primaryTypographyProps={{
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        noWrap: true,
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conversation.id);
                      }}
                      sx={{
                        opacity: 0.5,
                        color: "text.secondary",
                        "&:hover": {
                          opacity: 1,
                          color: "error.main",
                          background: "rgba(239, 68, 68, 0.05)",
                        },
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        {/* Footer */}
        <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontSize: "0.7rem",
              textAlign: "center",
              display: "block",
            }}
          >
            Source Chat
          </Typography>
        </Box>
      </Box>
    );

    return (
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        variant={isMobile ? "temporary" : "persistent"}
        sx={{
          "& .MuiDrawer-paper": {
            border: "none",
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "8px 0 32px rgba(0, 0, 0, 0.4)"
                : "8px 0 32px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }
);

Sidebar.displayName = "Sidebar";
