import axios, { AxiosResponse } from "axios";
import { ApiResponse, ChatRequest, ModelsResponse } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Thread-related types
export interface MessageThread {
  _id: string;
  title: string;
  model: string;
  createdAt: string;
  updatedAt: string;
}

export interface ThreadsResponse {
  threads: MessageThread[];
  total: number;
}

export const api = {
  async getModels(): Promise<ModelsResponse> {
    const response: AxiosResponse<ApiResponse<ModelsResponse>> =
      await apiClient.get("/chat/models");

    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to fetch models");
    }

    return response.data.data!;
  },

  async streamChat(request: ChatRequest): Promise<{
    stream: ReadableStream<Uint8Array>;
    threadId?: string;
  }> {
    // Use fetch for streaming since axios doesn't handle streaming well in browsers
    const response = await fetch(`${API_BASE_URL}/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to start chat stream: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error("No response body available");
    }

    // Extract thread ID from response headers
    const threadId = response.headers.get("X-Thread-Id") || undefined;

    return {
      stream: response.body,
      threadId,
    };
  },

  // Thread management APIs
  async getThreads(params?: {
    limit?: number;
    skip?: number;
    search?: string;
  }): Promise<ThreadsResponse> {
    const response: AxiosResponse<ApiResponse<ThreadsResponse>> =
      await apiClient.get("/threads", { params });

    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to fetch threads");
    }

    return response.data.data!;
  },

  async deleteThread(threadId: string): Promise<void> {
    const response: AxiosResponse<ApiResponse<never>> = await apiClient.delete(
      `/threads/${threadId}`
    );

    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to delete thread");
    }
  },

  async updateThread(
    threadId: string,
    updates: { title?: string; model?: string }
  ): Promise<MessageThread> {
    const response: AxiosResponse<ApiResponse<{ thread: MessageThread }>> =
      await apiClient.put(`/threads/${threadId}`, updates);

    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to update thread");
    }

    return response.data.data!.thread;
  },

  async getThreadMessages(threadId: string): Promise<any[]> {
    const response: AxiosResponse<ApiResponse<{ messages: any[] }>> =
      await apiClient.get(`/threads/${threadId}/messages`);

    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to fetch thread messages");
    }

    return response.data.data!.messages;
  },
};
