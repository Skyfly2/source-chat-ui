import { Add, Chat, Delete, Edit, MoreVert } from "@mui/icons-material";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { memo, useState } from "react";

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
    onRenameConversation,
  }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [selectedConversation, setSelectedConversation] = useState<
      string | null
    >(null);

    const handleMenuOpen = (
      event: React.MouseEvent<HTMLElement>,
      conversationId: string
    ) => {
      event.stopPropagation();
      setMenuAnchor(event.currentTarget);
      setSelectedConversation(conversationId);
    };

    const handleMenuClose = () => {
      setMenuAnchor(null);
      setSelectedConversation(null);
    };

    const handleDelete = () => {
      if (selectedConversation) {
        onDeleteConversation(selectedConversation);
      }
      handleMenuClose();
    };

    const handleRename = () => {
      if (selectedConversation) {
        const conversation = conversations.find(
          (c) => c.id === selectedConversation
        );
        if (conversation) {
          const newTitle = prompt("Rename conversation:", conversation.title);
          if (newTitle && newTitle.trim()) {
            onRenameConversation(selectedConversation, newTitle.trim());
          }
        }
      }
      handleMenuClose();
    };

    const sidebarContent = (
      <Box
        sx={{
          width: 280,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
              : "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
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
              py: 1.5,
              px: 2,
              borderRadius: 2,
              background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
              color: "white",
              fontWeight: 500,
              fontSize: "0.95rem",
              textTransform: "none",
              transition: "all 0.15s ease-out",
              "&:hover": {
                background: "linear-gradient(135deg, #3730a3 0%, #4f46e5 100%)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
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
                          ? "linear-gradient(135deg, rgba(79, 70, 229, 0.2) 0%, rgba(99, 102, 241, 0.15) 100%)"
                          : "linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(99, 102, 241, 0.08) 100%)",
                      "&:hover": {
                        background: (theme) =>
                          theme.palette.mode === "dark"
                            ? "linear-gradient(135deg, rgba(79, 70, 229, 0.25) 0%, rgba(99, 102, 241, 0.2) 100%)"
                            : "linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(99, 102, 241, 0.12) 100%)",
                      },
                    },
                    "&:hover": {
                      background: (theme) =>
                        theme.palette.mode === "dark"
                          ? "linear-gradient(135deg, rgba(148, 163, 184, 0.1) 0%, rgba(148, 163, 184, 0.05) 100%)"
                          : "linear-gradient(135deg, rgba(148, 163, 184, 0.08) 0%, rgba(148, 163, 184, 0.03) 100%)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32, color: "text.secondary" }}>
                    <Chat fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={conversation.title}
                    secondary={conversation.lastMessage}
                    primaryTypographyProps={{
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      noWrap: true,
                    }}
                    secondaryTypographyProps={{
                      fontSize: "0.75rem",
                      noWrap: true,
                      sx: { opacity: 0.7 },
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, conversation.id)}
                    sx={{
                      opacity: 0.6,
                      "&:hover": { opacity: 1 },
                    }}
                  >
                    <MoreVert fontSize="small" />
                  </IconButton>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
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
      <>
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

        {/* Context Menu */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              borderRadius: 2,
              border: "1px solid",
              borderColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(148, 163, 184, 0.15)"
                  : "rgba(148, 163, 184, 0.2)",
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.98) 100%)"
                  : "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 100%)",
              backdropFilter: "blur(12px)",
            },
          }}
        >
          <MenuItem onClick={handleRename} sx={{ fontSize: "0.9rem" }}>
            <Edit fontSize="small" sx={{ mr: 1.5 }} />
            Rename
          </MenuItem>
          <MenuItem
            onClick={handleDelete}
            sx={{ fontSize: "0.9rem", color: "error.main" }}
          >
            <Delete fontSize="small" sx={{ mr: 1.5 }} />
            Delete
          </MenuItem>
        </Menu>
      </>
    );
  }
);

Sidebar.displayName = "Sidebar";
