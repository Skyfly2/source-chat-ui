import { memo } from "react";
import { ChatMessage } from "../../types";
import { AssistantMessage } from "./AssistantMessage";
import { UserMessage } from "./UserMessage";

interface ChatBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

export const ChatBubble = memo<ChatBubbleProps>(({ message, isStreaming }) => {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  if (isUser) {
    return <UserMessage content={message.content} />;
  }

  if (isAssistant) {
    return (
      <AssistantMessage content={message.content} isStreaming={isStreaming} />
    );
  }

  return null;
});

ChatBubble.displayName = "ChatBubble";
