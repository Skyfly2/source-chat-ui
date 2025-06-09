import { Box } from "@mui/material";
import { memo, useEffect, useRef } from "react";
import { ChatMessage } from "../../types";
import { AssistantMessage } from "./AssistantMessage";
import { UserMessage } from "./UserMessage";

interface MessagesListProps {
  messages: ChatMessage[];
  isStreaming: boolean;
}

export const MessagesList = memo<MessagesListProps>(
  ({ messages, isStreaming }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
      scrollToBottom();
    }, [messages]);

    return (
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          py: 0,
          maxWidth: "100%",
          willChange: "scroll-position",
          "&::-webkit-scrollbar": {
            width: 4,
          },
          "&::-webkit-scrollbar-track": {
            bgcolor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(148, 163, 184, 0.3)"
                : "rgba(148, 163, 184, 0.4)",
            borderRadius: 2,
          },
        }}
      >
        <Box
          sx={{
            maxWidth: {
              xs: "100%",
              sm: "500px",
              md: "600px",
              lg: "800px",
              xl: "900px",
            },
            mx: "auto",
            px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 },
          }}
        >
          {messages.map((message) => {
            const isLastMessage = message === messages[messages.length - 1];
            const showStreaming =
              isStreaming && message.role === "assistant" && isLastMessage;

            return message.role === "user" ? (
              <UserMessage key={message.id} content={message.content} />
            ) : (
              <AssistantMessage
                key={message.id}
                content={message.content}
                isStreaming={showStreaming}
              />
            );
          })}
          <div ref={messagesEndRef} />
        </Box>
      </Box>
    );
  }
);

MessagesList.displayName = "MessagesList";
