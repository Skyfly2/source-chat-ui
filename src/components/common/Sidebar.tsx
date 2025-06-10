import { Box, Drawer, useMediaQuery, useTheme } from "@mui/material";
import { memo } from "react";
import { NewChatButton } from "./NewChatButton";
import { ThreadsList } from "./ThreadsList";
import { UserProfilePreview } from "./UserProfilePreview";

interface Thread {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  threads?: Thread[];
  currentThreadId?: string;
  onNewChat: () => void;
  onSelectThread: (id: string) => void;
  onDeleteThread: (id: string) => void;
  onRenameThread: (id: string, newTitle: string) => void;
  isLoading?: boolean;
}

export const Sidebar = memo<SidebarProps>(
  ({
    open,
    onClose,
    threads = [],
    currentThreadId,
    onNewChat,
    onSelectThread,
    onDeleteThread,
    onRenameThread: _onRenameThread,
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
        <Box sx={{ p: 2 }}>
          <NewChatButton onClick={onNewChat} />
        </Box>
        <ThreadsList
          threads={threads}
          currentThreadId={currentThreadId}
          isLoading={isLoading}
          onSelectThread={onSelectThread}
          onDeleteThread={onDeleteThread}
        />
        <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
          <UserProfilePreview />
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
