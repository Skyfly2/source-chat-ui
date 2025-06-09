import { useCallback, useMemo } from "react";
import { ConversationThread } from "../types";
import { useChatState } from "./useChatState";

interface UseConversationsReturn {
  conversations: ConversationThread[];
  createConversation: (id: string, title: string, firstMessage: string) => void;
  updateConversation: (
    id: string,
    updates: Partial<ConversationThread>
  ) => void;
  deleteConversation: (id: string) => void;
  getConversation: (id: string) => ConversationThread | undefined;
}

export const useConversations = (): UseConversationsReturn => {
  const { state, updateMessages } = useChatState();

  const generateConversationTitle = useCallback((message: string): string => {
    const words = message.split(" ");
    if (words.length <= 6) return message;
    return words.slice(0, 6).join(" ") + "...";
  }, []);

  // Convert message threads to conversation threads, sorted by most recent activity
  const conversations = useMemo(() => {
    const conversationMap = new Map<string, ConversationThread>();

    // Build conversations from message threads
    Object.entries(state.chat.messages).forEach(([threadId, messages]) => {
      if (messages.length === 0) return;

      // Sort messages by timestamp to get the first and last
      const sortedMessages = [...messages].sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      const firstMessage = sortedMessages[0];
      const lastMessage = sortedMessages[sortedMessages.length - 1];

      conversationMap.set(threadId, {
        id: threadId,
        title: generateConversationTitle(firstMessage.content),
        lastMessage: lastMessage.content,
        timestamp: new Date(lastMessage.timestamp),
        messages: sortedMessages,
      });
    });

    // Return conversations sorted by most recent activity
    return Array.from(conversationMap.values()).sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  }, [state.chat.messages, generateConversationTitle]);

  const createConversation = useCallback(
    (id: string, title: string, firstMessage: string) => {
      // Conversations are automatically created when messages are added via useChat
      // This is a placeholder for future conversation metadata management
    },
    []
  );

  const updateConversation = useCallback(
    (id: string, updates: Partial<ConversationThread>) => {
      // For now, we only support updating the title since other fields are derived from messages
      // Future enhancement could include storing conversation metadata separately
    },
    []
  );

  const deleteConversation = useCallback(
    (id: string) => {
      // Clear all messages for the thread
      updateMessages(id, []);
    },
    [updateMessages]
  );

  const getConversation = useCallback(
    (id: string) => {
      return conversations.find((conv) => conv.id === id);
    },
    [conversations]
  );

  return {
    conversations,
    createConversation,
    updateConversation,
    deleteConversation,
    getConversation,
  };
};
