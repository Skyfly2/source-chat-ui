import React, { createContext, ReactNode, useContext, useReducer } from "react";
import {
  AppState,
  ChatState,
  SidebarState,
  StateAction,
  UIState,
} from "../types/state";

const initialSidebarState: SidebarState = {
  isOpen: true,
  isCollapsed: false,
  width: 280,
};

const initialChatState: ChatState = {
  currentThreadId: null,
  isStreaming: false,
  selectedModel: "gpt-4o",
  messages: {},
};

const initialUIState: UIState = {
  theme: "dark",
  modelSelectorOpen: false,
  settingsOpen: false,
};

const initialState: AppState = {
  sidebar: initialSidebarState,
  chat: initialChatState,
  ui: initialUIState,
};

const chatStateReducer = (state: AppState, action: StateAction): AppState => {
  switch (action.type) {
    case "TOGGLE_SIDEBAR":
      return {
        ...state,
        sidebar: {
          ...state.sidebar,
          isOpen: !state.sidebar.isOpen,
        },
      };

    case "SET_SIDEBAR_OPEN":
      return {
        ...state,
        sidebar: {
          ...state.sidebar,
          isOpen: action.payload,
        },
      };

    case "SET_SIDEBAR_COLLAPSED":
      return {
        ...state,
        sidebar: {
          ...state.sidebar,
          isCollapsed: action.payload,
        },
      };

    case "SET_SIDEBAR_WIDTH":
      return {
        ...state,
        sidebar: {
          ...state.sidebar,
          width: action.payload,
        },
      };

    case "SET_CURRENT_THREAD":
      return {
        ...state,
        chat: {
          ...state.chat,
          currentThreadId: action.payload,
        },
      };

    case "SET_STREAMING":
      return {
        ...state,
        chat: {
          ...state.chat,
          isStreaming: action.payload,
        },
      };

    case "SET_SELECTED_MODEL":
      return {
        ...state,
        chat: {
          ...state.chat,
          selectedModel: action.payload,
        },
      };

    case "UPDATE_MESSAGES":
      return {
        ...state,
        chat: {
          ...state.chat,
          messages: {
            ...state.chat.messages,
            [action.payload.threadId]: action.payload.messages,
          },
        },
      };

    case "SET_THEME":
      return {
        ...state,
        ui: {
          ...state.ui,
          theme: action.payload,
        },
      };

    case "SET_MODEL_SELECTOR_OPEN":
      return {
        ...state,
        ui: {
          ...state.ui,
          modelSelectorOpen: action.payload,
        },
      };

    case "SET_SETTINGS_OPEN":
      return {
        ...state,
        ui: {
          ...state.ui,
          settingsOpen: action.payload,
        },
      };

    case "RESET_STATE":
      return initialState;

    default:
      return state;
  }
};

interface ChatStateContextValue {
  state: AppState;
  dispatch: React.Dispatch<StateAction>;
}

const ChatStateContext = createContext<ChatStateContextValue | undefined>(
  undefined
);

interface ChatStateProviderProps {
  children: ReactNode;
}

export const ChatStateProvider: React.FC<ChatStateProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(chatStateReducer, initialState);

  return (
    <ChatStateContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatStateContext.Provider>
  );
};

export const useChatStateContext = () => {
  const context = useContext(ChatStateContext);
  if (context === undefined) {
    throw new Error(
      "useChatStateContext must be used within a ChatStateProvider"
    );
  }
  return context;
};
