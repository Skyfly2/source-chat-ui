import axios, { AxiosResponse } from "axios";
import {
  AllModelsResponse,
  ApiResponse,
  ChatRequest,
  ImportantModelsResponse,
  ModelsResponse,
} from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const createApiClient = (authToken?: string | null) => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
  });

  if (authToken) {
    client.defaults.headers.common["Authorization"] = `Bearer ${authToken}`;
  }

  return client;
};

const getAuthHeaders = (authToken?: string | null): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  return headers;
};

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
  async getModels(authToken?: string | null): Promise<ModelsResponse> {
    const client = createApiClient(authToken);
    const response: AxiosResponse<ApiResponse<ModelsResponse>> =
      await client.get("/chat/models");

    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to fetch models");
    }

    return response.data.data!;
  },

  async getImportantModels(
    authToken?: string | null
  ): Promise<ImportantModelsResponse> {
    const client = createApiClient(authToken);
    const response: AxiosResponse<ApiResponse<ImportantModelsResponse>> =
      await client.get("/chat/models/important");

    if (!response.data.success) {
      throw new Error(
        response.data.error || "Failed to fetch important models"
      );
    }

    return response.data.data!;
  },

  async getAllModels(authToken?: string | null): Promise<AllModelsResponse> {
    const client = createApiClient(authToken);
    const response: AxiosResponse<ApiResponse<AllModelsResponse>> =
      await client.get("/chat/models/all");

    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to fetch all models");
    }

    return response.data.data!;
  },

  async streamChat(
    request: ChatRequest,
    authToken?: string | null
  ): Promise<{
    stream: ReadableStream<Uint8Array>;
    threadId?: string;
  }> {
    const response = await fetch(`${API_BASE_URL}/chat/stream`, {
      method: "POST",
      headers: getAuthHeaders(authToken),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Failed to start chat stream: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error("No response body available");
    }

    const threadId = response.headers.get("X-Thread-Id") || undefined;

    return {
      stream: response.body,
      threadId,
    };
  },

  async getThreads(
    params?: {
      limit?: number;
      skip?: number;
      search?: string;
    },
    authToken?: string | null
  ): Promise<ThreadsResponse> {
    const client = createApiClient(authToken);
    const response: AxiosResponse<ApiResponse<ThreadsResponse>> =
      await client.get("/threads", { params });

    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to fetch threads");
    }

    return response.data.data!;
  },

  async deleteThread(
    threadId: string,
    authToken?: string | null
  ): Promise<void> {
    const client = createApiClient(authToken);
    const response: AxiosResponse<ApiResponse<never>> = await client.delete(
      `/threads/${threadId}`
    );

    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to delete thread");
    }
  },

  async updateThread(
    threadId: string,
    updates: { title?: string; model?: string },
    authToken?: string | null
  ): Promise<MessageThread> {
    const client = createApiClient(authToken);
    const response: AxiosResponse<ApiResponse<{ thread: MessageThread }>> =
      await client.put(`/threads/${threadId}`, updates);

    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to update thread");
    }

    return response.data.data!.thread;
  },

  async getThreadMessages(
    threadId: string,
    authToken?: string | null
  ): Promise<any[]> {
    const client = createApiClient(authToken);
    const response: AxiosResponse<ApiResponse<{ messages: any[] }>> =
      await client.get(`/threads/${threadId}/messages`);

    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to fetch thread messages");
    }

    return response.data.data!.messages;
  },
};
