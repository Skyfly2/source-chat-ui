import { useMemo } from "react";
import {
  useDeleteThreadMutation,
  useThreadsQuery,
  useUpdateThreadMutation,
} from "../queries/threads";

interface ConversationThread {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

interface UseThreadsReturn {
  conversations: ConversationThread[];
  isLoading: boolean;
  error: string | null;
  refreshThreads: () => void;
  deleteThread: (threadId: string) => Promise<void>;
  updateThreadTitle: (threadId: string, title: string) => Promise<void>;
}

export const useThreads = (): UseThreadsReturn => {
  const { data, isLoading, error, refetch } = useThreadsQuery({ limit: 50 });
  const deleteThreadMutation = useDeleteThreadMutation();
  const updateThreadMutation = useUpdateThreadMutation();

  // Convert backend threads to conversation format expected by UI
  const conversations = useMemo(() => {
    if (!data?.threads) return [];

    return data.threads.map((thread) => ({
      id: thread._id,
      title: thread.title,
      lastMessage: "", // We don't have last message from threads API, could be enhanced
      timestamp: new Date(thread.updatedAt),
    }));
  }, [data?.threads]);

  const deleteThread = async (threadId: string) => {
    try {
      await deleteThreadMutation.mutateAsync(threadId);
    } catch (err) {
      throw err; // Re-throw so caller can handle it
    }
  };

  const updateThreadTitle = async (threadId: string, title: string) => {
    try {
      await updateThreadMutation.mutateAsync({ threadId, updates: { title } });
    } catch (err) {
      throw err; // Re-throw so caller can handle it
    }
  };

  return {
    conversations,
    isLoading,
    error: error?.message || null,
    refreshThreads: () => refetch(),
    deleteThread,
    updateThreadTitle,
  };
};
