import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../api";
import { useAuthContext } from "../contexts/AuthContext";
import { ChatMessage, ChatRequest } from "../types";
import { generateObjectId } from "../utils/objectId";
import { useChatState } from "./useChatState";

interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
  sendMessage: (message: string, model?: string) => Promise<string | null>;
  clearMessages: () => void;
  clearError: () => void;
}

export const useChat = (): UseChatReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempMessages, setTempMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const { state, setCurrentThread, setStreaming, updateMessages } =
    useChatState();
  const { getToken } = useAuthContext();
  const currentThreadId = state.chat.currentThreadId;

  // Load messages when thread changes
  useEffect(() => {
    const loadThreadMessages = async () => {
      if (!currentThreadId) return;

      // Don't load if we already have messages for this thread
      if (state.chat.messages[currentThreadId]?.length > 0) return;

      try {
        setLoadingMessages(true);
        setError(null);
        const backendMessages = await api.getThreadMessages(currentThreadId);

        // Convert backend messages to ChatMessage format
        const chatMessages: ChatMessage[] = backendMessages.map((msg: any) => ({
          id: msg._id || generateObjectId(),
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.createdAt || msg.timestamp),
          model: msg.model,
        }));

        // Update global state with loaded messages
        updateMessages(currentThreadId, chatMessages);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load thread messages"
        );
      } finally {
        setLoadingMessages(false);
      }
    };

    loadThreadMessages();
  }, [currentThreadId, state.chat.messages, updateMessages]);

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
    async (message: string, model?: string): Promise<string | null> => {
      if (!message.trim()) return null;

      setError(null);
      setIsLoading(true);
      setStreaming(true);

      let threadId = currentThreadId;

      const userMessage: ChatMessage = {
        id: generateObjectId(),
        role: "user",
        content: message,
        timestamp: new Date(),
      };

      let messagesWithUser: ChatMessage[] = [];
      if (threadId) {
        const currentMessages = state.chat.messages[threadId] || [];
        messagesWithUser = [...currentMessages, userMessage];
        updateMessages(threadId, messagesWithUser);
      } else {
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
          })),
          threadId: threadId || undefined,
        };

        // Get auth token and pass it to the API call
        const authToken = await getToken();
        const { stream, threadId: serverThreadId } = await api.streamChat(
          chatRequest,
          authToken || undefined
        );

        const reader = stream.getReader();
        const decoder = new TextDecoder();

        let accumulatedContent = "";

        if (serverThreadId && !threadId) {
          setCurrentThread(serverThreadId);
          threadId = serverThreadId;
          updateMessages(serverThreadId, messagesWithAssistant);
          setTempMessages([]);
        }

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          accumulatedContent += chunk;

          const updatedMessages = messagesWithAssistant.map((msg) =>
            msg.id === assistantMessage.id
              ? { ...msg, content: accumulatedContent }
              : msg
          );

          if (threadId) {
            updateMessages(threadId, updatedMessages);
          } else {
            setTempMessages(updatedMessages);
          }
        }

        setStreaming(false);
        return threadId;
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setIsLoading(false);
        setStreaming(false);

        if (threadId) {
          const currentThreadMessages = state.chat.messages[threadId] || [];
          if (currentThreadMessages.length > 0) {
            updateMessages(threadId, currentThreadMessages.slice(0, -1));
          }
        } else {
          setTempMessages((prev) => prev.slice(0, -1));
        }
        return null;
      }
    },
    [
      currentThreadId,
      setCurrentThread,
      setStreaming,
      updateMessages,
      state.chat.messages,
      tempMessages,
      getToken,
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
    isLoading: isLoading || loadingMessages,
    isStreaming: state.chat.isStreaming,
    error,
    sendMessage,
    clearMessages,
    clearError,
  };
};
