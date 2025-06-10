import { Box, CircularProgress, List, Typography } from "@mui/material";
import { ThreadItem } from "./ThreadItem";

interface Thread {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

interface ThreadsListProps {
  threads: Thread[];
  currentThreadId?: string;
  isLoading: boolean;
  onSelectThread: (id: string) => void;
  onDeleteThread: (id: string) => void;
}

export const ThreadsList: React.FC<ThreadsListProps> = ({
  threads,
  currentThreadId,
  isLoading,
  onSelectThread,
  onDeleteThread,
}) => {
  return (
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
      ) : threads.length === 0 ? (
        <Box sx={{ px: 2, py: 4 }}>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              textAlign: "center",
              fontSize: "0.8rem",
            }}
          >
            No threads yet
          </Typography>
        </Box>
      ) : (
        <List sx={{ px: 1, py: 0 }}>
          {threads.map((thread) => (
            <ThreadItem
              key={thread.id}
              id={thread.id}
              title={thread.title}
              isSelected={thread.id === currentThreadId}
              onSelect={onSelectThread}
              onDelete={onDeleteThread}
            />
          ))}
        </List>
      )}
    </Box>
  );
};
