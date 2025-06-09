export interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean;
  width: number;
}

export interface ChatState {
  currentThreadId: string | null;
  isStreaming: boolean;
  selectedModel: string;
  messages: Record<string, any[]>;
}

export interface UIState {
  theme: "light" | "dark";
  modelSelectorOpen: boolean;
  settingsOpen: boolean;
}

export interface AppState {
  sidebar: SidebarState;
  chat: ChatState;
  ui: UIState;
}

export type ActionType =
  | "TOGGLE_SIDEBAR"
  | "SET_SIDEBAR_OPEN"
  | "SET_SIDEBAR_COLLAPSED"
  | "SET_SIDEBAR_WIDTH"
  | "SET_CURRENT_THREAD"
  | "SET_STREAMING"
  | "SET_SELECTED_MODEL"
  | "UPDATE_MESSAGES"
  | "SET_THEME"
  | "SET_MODEL_SELECTOR_OPEN"
  | "SET_SETTINGS_OPEN"
  | "RESET_STATE";

export interface StateAction {
  type: ActionType;
  payload?: any;
}
