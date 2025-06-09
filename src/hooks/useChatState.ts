import { useCallback } from "react";
import { useChatStateContext } from "../context/ChatStateContext";
import { AppState } from "../types/state";

interface ChatStateHook {
  state: AppState;

  // Sidebar actions
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setSidebarCollapsed: (isCollapsed: boolean) => void;
  setSidebarWidth: (width: number) => void;

  // Chat actions
  setCurrentThread: (threadId: string | null) => void;
  setStreaming: (isStreaming: boolean) => void;
  setSelectedModel: (model: string) => void;
  updateMessages: (threadId: string, messages: any[]) => void;

  // UI actions
  setTheme: (theme: "light" | "dark") => void;
  setModelSelectorOpen: (isOpen: boolean) => void;
  setSettingsOpen: (isOpen: boolean) => void;

  // General actions
  resetState: () => void;
}

export const useChatState = (): ChatStateHook => {
  const { state, dispatch } = useChatStateContext();

  // Sidebar actions
  const toggleSidebar = useCallback(() => {
    dispatch({ type: "TOGGLE_SIDEBAR" });
  }, [dispatch]);

  const setSidebarOpen = useCallback(
    (isOpen: boolean) => {
      dispatch({ type: "SET_SIDEBAR_OPEN", payload: isOpen });
    },
    [dispatch]
  );

  const setSidebarCollapsed = useCallback(
    (isCollapsed: boolean) => {
      dispatch({ type: "SET_SIDEBAR_COLLAPSED", payload: isCollapsed });
    },
    [dispatch]
  );

  const setSidebarWidth = useCallback(
    (width: number) => {
      dispatch({ type: "SET_SIDEBAR_WIDTH", payload: width });
    },
    [dispatch]
  );

  // Chat actions
  const setCurrentThread = useCallback(
    (threadId: string | null) => {
      dispatch({ type: "SET_CURRENT_THREAD", payload: threadId });
    },
    [dispatch]
  );

  const setStreaming = useCallback(
    (isStreaming: boolean) => {
      dispatch({ type: "SET_STREAMING", payload: isStreaming });
    },
    [dispatch]
  );

  const setSelectedModel = useCallback(
    (model: string) => {
      dispatch({ type: "SET_SELECTED_MODEL", payload: model });
    },
    [dispatch]
  );

  const updateMessages = useCallback(
    (threadId: string, messages: any[]) => {
      dispatch({
        type: "UPDATE_MESSAGES",
        payload: { threadId, messages },
      });
    },
    [dispatch]
  );

  // UI actions
  const setTheme = useCallback(
    (theme: "light" | "dark") => {
      dispatch({ type: "SET_THEME", payload: theme });
    },
    [dispatch]
  );

  const setModelSelectorOpen = useCallback(
    (isOpen: boolean) => {
      dispatch({ type: "SET_MODEL_SELECTOR_OPEN", payload: isOpen });
    },
    [dispatch]
  );

  const setSettingsOpen = useCallback(
    (isOpen: boolean) => {
      dispatch({ type: "SET_SETTINGS_OPEN", payload: isOpen });
    },
    [dispatch]
  );

  // General actions
  const resetState = useCallback(() => {
    dispatch({ type: "RESET_STATE" });
  }, [dispatch]);

  return {
    state,
    toggleSidebar,
    setSidebarOpen,
    setSidebarCollapsed,
    setSidebarWidth,
    setCurrentThread,
    setStreaming,
    setSelectedModel,
    updateMessages,
    setTheme,
    setModelSelectorOpen,
    setSettingsOpen,
    resetState,
  };
};
