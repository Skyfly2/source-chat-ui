import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../api";
import { useAuthContext } from "../contexts/AuthContext";
import { useThreadMessagesQuery } from "../queries/threads";
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
  refetchThread: () => void;
}

export const useChat = (): UseChatReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempMessages, setTempMessages] = useState<ChatMessage[]>([]);
  const [loadedThreads, setLoadedThreads] = useState<Set<string>>(new Set());

  const { getToken } = useAuthContext();
  const { state, setCurrentThread, setStreaming, updateMessages } =
    useChatState();
  const currentThreadId = state.chat.currentThreadId;
  const isStreaming = state.chat.isStreaming;

  const shouldLoadFromBackend =
    currentThreadId && !loadedThreads.has(currentThreadId);

  const { data: backendMessages, isLoading: loadingMessages } =
    useThreadMessagesQuery(
      shouldLoadFromBackend ? currentThreadId : null,
      isStreaming
    );

  // Load messages from backend ONCE when thread is first opened
  useEffect(() => {
    if (
      currentThreadId &&
      backendMessages &&
      backendMessages.length > 0 &&
      !isStreaming
    ) {
      const chatMessages: ChatMessage[] = backendMessages.map((msg: any) => ({
        id: msg._id || generateObjectId(),
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.createdAt || msg.timestamp),
        model: msg.model,
      }));

      updateMessages(currentThreadId, chatMessages);

      // Mark this thread as loaded so we don't refetch it
      setLoadedThreads((prev) => new Set(prev).add(currentThreadId));
    }
  }, [currentThreadId, backendMessages, updateMessages, isStreaming]);

  // Reset loaded threads when switching away from a thread
  useEffect(() => {
    if (!currentThreadId) {
      // Optionally clear loaded threads when no thread is active
      // setLoadedThreads(new Set());
    }
  }, [currentThreadId]);

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
          authToken
        );

        const reader = stream.getReader();
        const decoder = new TextDecoder();

        let accumulatedContent = "";

        if (serverThreadId && !threadId) {
          setCurrentThread(serverThreadId);
          threadId = serverThreadId;
          updateMessages(serverThreadId, messagesWithAssistant);
          setTempMessages([]);
          // Mark new thread as loaded since we're creating it
          setLoadedThreads((prev) => new Set(prev).add(serverThreadId));
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
      // Remove from loaded threads so it can be reloaded if needed
      setLoadedThreads((prev) => {
        const newSet = new Set(prev);
        newSet.delete(currentThreadId);
        return newSet;
      });
    }
    setTempMessages([]);
    setError(null);
    setCurrentThread(null);
  }, [currentThreadId, updateMessages, setCurrentThread]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refetchThread = useCallback(() => {
    if (currentThreadId) {
      // Remove from loaded threads to force a refetch
      setLoadedThreads((prev) => {
        const newSet = new Set(prev);
        newSet.delete(currentThreadId);
        return newSet;
      });
    }
  }, [currentThreadId]);

  return {
    messages,
    isLoading: isLoading || loadingMessages,
    isStreaming: state.chat.isStreaming,
    error,
    sendMessage,
    clearMessages,
    clearError,
    refetchThread,
  };
};
