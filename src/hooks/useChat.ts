import { useCallback, useState } from "react";
import { api } from "../api";
import { ChatMessage, ChatRequest } from "../types";
import { generateObjectId } from "../utils/objectId";
import { useChatState } from "./useChatState";

interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
  sendMessage: (message: string, model?: string) => Promise<void>;
  clearMessages: () => void;
  clearError: () => void;
}

export const useChat = (): UseChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { state, setCurrentThread, setStreaming } = useChatState();
  const currentThreadId = state.chat.currentThreadId;

  const sendMessage = useCallback(
    async (message: string, model?: string) => {
      if (!message.trim()) return;

      setError(null);
      setIsLoading(true);
      setStreaming(true);

      const userMessage: ChatMessage = {
        id: generateObjectId(),
        role: "user",
        content: message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);

      try {
        const assistantMessage: ChatMessage = {
          id: generateObjectId(),
          role: "assistant",
          content: "",
          timestamp: new Date(),
          model,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);

        const chatRequest: ChatRequest = {
          message,
          model,
          context: messages.slice(-10),
          messageId: userMessage.id,
        };

        // Only include threadId if we have an existing thread
        if (currentThreadId) {
          chatRequest.threadId = currentThreadId;
        }

        const stream = await api.streamChat(chatRequest);
        const reader = stream.getReader();
        const decoder = new TextDecoder();

        let accumulatedContent = "";
        let serverThreadId: string | null = null;

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          const chunk = decoder.decode(value, { stream: true });

          // Check if this chunk contains thread ID metadata (assuming server sends it)
          // This is a simple approach - you might need to adjust based on your server's format
          if (chunk.includes('"threadId"') && !serverThreadId) {
            try {
              const lines = chunk.split("\n");
              for (const line of lines) {
                if (line.startsWith("data: ") && line.includes("threadId")) {
                  const jsonStr = line.replace("data: ", "");
                  const data = JSON.parse(jsonStr);
                  if (data.threadId) {
                    serverThreadId = data.threadId;
                    break;
                  }
                }
              }
            } catch (e) {
              // Continue if parsing fails
            }
          }

          accumulatedContent += chunk;

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessage.id
                ? { ...msg, content: accumulatedContent }
                : msg
            )
          );
        }

        // If we got a threadId from server and don't have one set, set it
        if (serverThreadId && !currentThreadId) {
          setCurrentThread(serverThreadId);
        }

        setIsStreaming(false);
        setStreaming(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setIsLoading(false);
        setIsStreaming(false);
        setStreaming(false);

        // Remove the incomplete assistant message on error
        setMessages((prev) => prev.slice(0, -1));
      }
    },
    [messages, currentThreadId, setCurrentThread, setStreaming]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    setCurrentThread(null); // Clear the current thread for new conversation
  }, [setCurrentThread]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    isStreaming: state.chat.isStreaming,
    error,
    sendMessage,
    clearMessages,
    clearError,
  };
};
