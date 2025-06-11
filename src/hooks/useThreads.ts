import { useCallback, useEffect, useMemo, useState } from "react";
import { api, MessageThread } from "../api";
import { useAuthContext } from "../contexts/AuthContext";

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
  refreshThreads: () => Promise<void>;
  deleteThread: (threadId: string) => Promise<void>;
  updateThreadTitle: (threadId: string, title: string) => Promise<void>;
}

export const useThreads = (): UseThreadsReturn => {
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isSignedIn, isLoading: authLoading } = useAuthContext();

  // Convert backend threads to conversation format expected by UI
  const conversations = useMemo(() => {
    const result = threads.map((thread) => ({
      id: thread._id,
      title: thread.title,
      lastMessage: "", // We don't have last message from threads API, could be enhanced
      timestamp: new Date(thread.updatedAt),
    }));

    return result;
  }, [threads]);

  const fetchThreads = useCallback(async () => {
    if (authLoading || !isSignedIn) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      setIsLoading(true);
      const response = await api.getThreads({ limit: 50 }); // Get up to 50 recent threads
      setThreads(response.threads || []);
    } catch (err) {
      console.error("❌ Error fetching threads:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch threads");
    } finally {
      setIsLoading(false);
    }
  }, [authLoading, isSignedIn]);

  const deleteThread = useCallback(async (threadId: string) => {
    try {
      await api.deleteThread(threadId);
      // Remove the thread from local state
      setThreads((prev) => prev.filter((thread) => thread._id !== threadId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete thread");
      throw err; // Re-throw so caller can handle it
    }
  }, []);

  const updateThreadTitle = useCallback(
    async (threadId: string, title: string) => {
      try {
        const updatedThread = await api.updateThread(threadId, { title });
        // Update the thread in local state
        setThreads((prev) =>
          prev.map((thread) =>
            thread._id === threadId ? updatedThread : thread
          )
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update thread"
        );
        throw err; // Re-throw so caller can handle it
      }
    },
    []
  );

  // Fetch threads on mount
  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  // Fetch threads when auth is ready
  useEffect(() => {
    if (!authLoading && isSignedIn) {
      fetchThreads();
    }
  }, [authLoading, isSignedIn, fetchThreads]);

  return {
    conversations,
    isLoading,
    error,
    refreshThreads: fetchThreads,
    deleteThread,
    updateThreadTitle,
  };
};
