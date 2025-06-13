import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { useAuthContext } from "../contexts/AuthContext";

export const useThreadsQuery = (params?: {
  limit?: number;
  skip?: number;
  search?: string;
}) => {
  const { getToken, isSignedIn, isLoading: authLoading } = useAuthContext();

  return useQuery({
    queryKey: ["threads", params],
    queryFn: async () => {
      const token = await getToken();
      return api.getThreads(params, token);
    },
    enabled: !authLoading && isSignedIn,
  });
};

export const useDeleteThreadMutation = () => {
  const { getToken } = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (threadId: string) => {
      const token = await getToken();
      return api.deleteThread(threadId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["threads"] });
    },
  });
};

export const useUpdateThreadMutation = () => {
  const { getToken } = useAuthContext();

  return useMutation({
    mutationFn: async ({
      threadId,
      updates,
    }: {
      threadId: string;
      updates: { title?: string; model?: string };
    }) => {
      const token = await getToken();
      return api.updateThread(threadId, updates, token);
    },
  });
};

export const useThreadMessagesQuery = (
  threadId: string | null,
  isStreaming = false
) => {
  const { getToken, isSignedIn, isLoading: authLoading } = useAuthContext();

  return useQuery({
    queryKey: ["thread-messages", threadId],
    queryFn: async () => {
      if (!threadId) throw new Error("No thread ID provided");
      const token = await getToken();
      return api.getThreadMessages(threadId, token);
    },
    enabled: !authLoading && isSignedIn && !!threadId && !isStreaming,
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
