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
  threadId?: string;
}

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  message: string;
  model?: string;
  context?: AIMessage[];
  promptKey?: string;
  threadId?: string;
  webSearch?: boolean;
}

export * from "./state";

// OpenRouter Model Types
export interface OpenRouterModelPricing {
  prompt: string;
  completion: string;
  request: string;
  image: string;
  web_search: string;
  internal_reasoning: string;
  input_cache_read?: string;
  input_cache_write?: string;
}

export interface OpenRouterModelArchitecture {
  modality: string;
  input_modalities: string[];
  output_modalities: string[];
  tokenizer: string;
  instruct_type?: string | null;
}

export interface OpenRouterModelTopProvider {
  context_length: number;
  max_completion_tokens?: number | null;
  is_moderated: boolean;
}

export interface OpenRouterModel {
  id: string;
  name: string;
  created: number;
  description: string;
  context_length: number;
  architecture: OpenRouterModelArchitecture;
  pricing: OpenRouterModelPricing;
  top_provider: OpenRouterModelTopProvider;
  per_request_limits?: Record<string, unknown> | null;
  supported_parameters: string[];
  hugging_face_id?: string | null;
}

export interface ImportantModelsResponse {
  models: OpenRouterModel[];
  count: number;
}

export interface AllModelsResponse {
  models: OpenRouterModel[];
  totalModels: number;
}

export interface ModelsResponse {
  models: string[];
  modelDetails: ModelInfo[];
  availableProviders: string[];
}
