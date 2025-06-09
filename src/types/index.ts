export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  model?: string;
}

export interface ConversationThread {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages?: ChatMessage[];
}

export interface ModelFeatures {
  reasoning?: boolean;
  internet?: boolean;
  vision?: boolean;
  attachments?: boolean;
  codeExecution?: boolean;
  multimodal?: boolean;
}

export interface ModelInfo {
  name: string;
  displayName: string;
  provider: string;
  maxTokens: number;
  contextWindow: number;
  supportsStreaming: boolean;
  features?: ModelFeatures;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ChatRequest {
  message: string;
  model?: string;
  context?: ChatMessage[];
  promptKey?: string;
}

export interface ModelsResponse {
  models: string[];
  modelDetails: ModelInfo[];
  availableProviders: string[];
}
