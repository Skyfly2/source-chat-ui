import { useCallback, useMemo, useState } from "react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempMessages, setTempMessages] = useState<ChatMessage[]>([]);

  const { state, setCurrentThread, setStreaming, updateMessages } =
    useChatState();
  const currentThreadId = state.chat.currentThreadId;

  // Get messages for the current thread from global state, sorted by timestamp
  // If no thread ID, use temporary messages for new conversations
  const messages = useMemo(() => {
    if (!currentThreadId) {
      return tempMessages.sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    }

    const threadMessages = state.chat.messages[currentThreadId] || [];
    // Sort messages by timestamp to ensure proper chronological order
    return [...threadMessages].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [state.chat.messages, currentThreadId, tempMessages]);

  const updateCurrentThreadMessages = useCallback(
    (newMessages: ChatMessage[]) => {
      if (currentThreadId) {
        updateMessages(currentThreadId, newMessages);
      }
    },
    [currentThreadId, updateMessages]
  );

  const sendMessage = useCallback(
    async (message: string, model?: string) => {
      if (!message.trim()) return;

      setError(null);
      setIsLoading(true);
      setStreaming(true);

      // Use existing thread ID or let backend create one
      let threadId = currentThreadId;

      const userMessage: ChatMessage = {
        id: generateObjectId(),
        role: "user",
        content: message,
        timestamp: new Date(),
      };

      // Add user message to the thread or temporary storage
      let messagesWithUser: ChatMessage[] = [];
      if (threadId) {
        const currentMessages = state.chat.messages[threadId] || [];
        messagesWithUser = [...currentMessages, userMessage];
        updateMessages(threadId, messagesWithUser);
      } else {
        // For new threads, use temporary messages and update UI immediately
        messagesWithUser = [...tempMessages, userMessage];
        setTempMessages(messagesWithUser);
      }

      try {
        const assistantMessage: ChatMessage = {
          id: generateObjectId(),
          role: "assistant",
          content: "",
          timestamp: new Date(),
          model,
        };

        // Add initial assistant message to the thread or temporary storage
        const messagesWithAssistant = [...messagesWithUser, assistantMessage];
        if (threadId) {
          updateMessages(threadId, messagesWithAssistant);
        } else {
          setTempMessages(messagesWithAssistant);
        }
        setIsLoading(false);

        const chatRequest: ChatRequest = {
          message,
          model,
          context: messagesWithUser.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })), // Send full conversation history to backend
          threadId: threadId || undefined,
        };

        const { stream, threadId: serverThreadId } = await api.streamChat(
          chatRequest
        );
        const reader = stream.getReader();
        const decoder = new TextDecoder();

        let accumulatedContent = "";

        // If server provided a thread ID and we don't have one set, set it immediately
        if (serverThreadId && !threadId) {
          setCurrentThread(serverThreadId);
          threadId = serverThreadId; // Update local variable

          // Move temporary messages to the new thread
          updateMessages(serverThreadId, messagesWithAssistant);
          setTempMessages([]); // Clear temporary messages
        }

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          accumulatedContent += chunk;

          // Update the assistant message content
          const updatedMessages = messagesWithAssistant.map((msg) =>
            msg.id === assistantMessage.id
              ? { ...msg, content: accumulatedContent }
              : msg
          );

          // Update messages in the correct thread
          if (threadId) {
            updateMessages(threadId, updatedMessages);
          } else {
            // Update temporary messages for new conversations (shouldn't happen now)
            setTempMessages(updatedMessages);
          }
        }

        setStreaming(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setIsLoading(false);
        setStreaming(false);

        // Remove the incomplete assistant message on error
        if (threadId) {
          const currentThreadMessages = state.chat.messages[threadId] || [];
          if (currentThreadMessages.length > 0) {
            updateMessages(threadId, currentThreadMessages.slice(0, -1));
          }
        } else {
          // For new conversations, remove the assistant message from temp messages
          setTempMessages((prev) => prev.slice(0, -1));
        }
      }
    },
    [
      currentThreadId,
      setCurrentThread,
      setStreaming,
      updateMessages,
      state.chat.messages,
      tempMessages,
    ]
  );

  const clearMessages = useCallback(() => {
    if (currentThreadId) {
      updateMessages(currentThreadId, []);
    }
    setTempMessages([]); // Clear temporary messages
    setError(null);
    setCurrentThread(null); // Clear the current thread for new conversation
  }, [currentThreadId, updateMessages, setCurrentThread]);

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
