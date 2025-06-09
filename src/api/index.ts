import axios, { AxiosResponse } from "axios";
import { ApiResponse, ChatRequest, ModelsResponse } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

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
};
