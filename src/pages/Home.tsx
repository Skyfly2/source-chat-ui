import { Alert, Box, CircularProgress } from "@mui/material";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { ChatHeader } from "../components/common/ChatHeader";
import { ChatInput } from "../components/common/ChatInput";
import { MessagesList } from "../components/common/MessagesList";
import { Sidebar } from "../components/common/Sidebar";
import { SignIn } from "../components/common/SignIn";
import { WelcomeScreen } from "../components/common/WelcomeScreen";
import { useAuthContext } from "../contexts/AuthContext";
import { useChat } from "../hooks/useChat";
import { useChatState } from "../hooks/useChatState";
import { useModels } from "../hooks/useModels";
import { useThreads } from "../hooks/useThreads";

export const Home: React.FC = memo(() => {
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);

  const { isSignedIn, isLoading: authLoading } = useAuthContext();

  const {
    state,
    toggleSidebar: globalToggleSidebar,
    setSidebarOpen,
    setSelectedModel: globalSetSelectedModel,
    setCurrentThread,
  } = useChatState();

  const {
    messages,
    isLoading,
    isStreaming,
    error,
    sendMessage,
    clearMessages,
    clearError,
  } = useChat();

  const {
    conversations: threads,
    isLoading: threadsLoading,
    error: threadsError,
    refreshThreads,
    deleteThread,
    updateThreadTitle,
  } = useThreads();

  const {
    models,
    modelDetails,
    selectedModel,
    isLoading: modelsLoading,
    error: modelsError,
    setSelectedModel,
    refreshModels: _refreshModels,
  } = useModels();

  const threadsRef = useRef<string[]>([]);

  useEffect(() => {
    if (
      state.chat.currentThreadId &&
      state.chat.currentThreadId !== currentThreadId
    ) {
      setCurrentThreadId(state.chat.currentThreadId);
    }
  }, [state.chat.currentThreadId, currentThreadId]);

  useEffect(() => {
    const refreshIfNewThread = async () => {
      if (state.chat.currentThreadId) {
        if (!threadsRef.current.includes(state.chat.currentThreadId)) {
          console.log(
            "🔄 Refreshing threads for new thread ID:",
            state.chat.currentThreadId
          );

          threadsRef.current.push(state.chat.currentThreadId);

          await new Promise((resolve) => setTimeout(resolve, 300));
          await refreshThreads();
        }
      }
    };

    refreshIfNewThread();
  }, [state.chat.currentThreadId, refreshThreads]);

  const handleSendMessage = useCallback(
    async (message: string) => {
      const wasNewThread = !currentThreadId && !state.chat.currentThreadId;

      const resultThreadId = await sendMessage(message, selectedModel);

      if (wasNewThread && resultThreadId) {
        setCurrentThreadId(resultThreadId);
      }
    },
    [sendMessage, selectedModel, state.chat.currentThreadId, currentThreadId]
  );

  const handleNewChat = useCallback(() => {
    clearMessages();
    setCurrentThreadId(null);
    setSidebarOpen(false);
  }, [clearMessages, setSidebarOpen]);

  const handleSelectThread = useCallback(
    (id: string) => {
      setCurrentThreadId(id);
      setCurrentThread(id);
      setSidebarOpen(false);
    },
    [setSidebarOpen, setCurrentThread]
  );

  const handleDeleteThread = useCallback(
    async (id: string) => {
      try {
        await deleteThread(id);
        if (currentThreadId === id) {
          handleNewChat();
        }
      } catch (err) {
        console.error("Failed to delete thread:", err);
      }
    },
    [currentThreadId, handleNewChat, deleteThread]
  );

  const handleRenameThread = useCallback(
    async (id: string, newTitle: string) => {
      try {
        await updateThreadTitle(id, newTitle);
      } catch (err) {
        console.error("Failed to rename thread:", err);
      }
    },
    [updateThreadTitle]
  );

  if (authLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isSignedIn) {
    return <SignIn />;
  }

  const currentThread = threads.find(
    (thread) => thread.id === (currentThreadId || state.chat.currentThreadId)
  );
  const hasMessages = messages.length > 0;
  const showWelcome = !hasMessages && !isLoading;

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <Sidebar
        open={state.sidebar.isOpen}
        onClose={() => setSidebarOpen(false)}
        threads={threads}
        currentThreadId={
          currentThreadId || state.chat.currentThreadId || undefined
        }
        onNewChat={handleNewChat}
        onSelectThread={handleSelectThread}
        onDeleteThread={handleDeleteThread}
        onRenameThread={handleRenameThread}
        isLoading={threadsLoading}
      />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          transition: "margin-left 0.3s ease-out",
          marginLeft: (theme) => {
            const isDesktop = theme.breakpoints.up("md");
            return state.sidebar.isOpen && isDesktop ? "280px" : "0";
          },
        }}
      >
        <ChatHeader
          onToggleSidebar={globalToggleSidebar}
          currentConversationTitle={currentThread?.title || undefined}
          onNewThread={handleNewChat}
          sidebarOpen={state.sidebar.isOpen}
          onRefreshThreads={refreshThreads}
        />

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
            paddingBottom: "120px",
          }}
        >
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              position: "relative",
            }}
          >
            {showWelcome ? (
              <WelcomeScreen show={showWelcome} />
            ) : (
              <MessagesList messages={messages} isStreaming={isStreaming} />
            )}
          </Box>

          {(error || modelsError || threadsError) && (
            <Alert
              severity="error"
              onClose={clearError}
              sx={{
                position: "absolute",
                top: 16,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1000,
                maxWidth: "90%",
                width: "fit-content",
              }}
            >
              {error || modelsError || threadsError}
            </Alert>
          )}
        </Box>

        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            paddingLeft: (theme) => {
              const isDesktop = theme.breakpoints.up("md");
              return state.sidebar.isOpen && isDesktop ? "280px" : "0";
            },
            transition: "padding-left 0.3s ease-out",
          }}
        >
          <Box sx={{ p: { xs: 1, sm: 2 } }}>
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={isLoading || modelsLoading || !selectedModel}
              isStreaming={isStreaming}
              placeholder="Message Source Chat..."
              models={models}
              modelDetails={modelDetails}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              modelsLoading={modelsLoading}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
});

Home.displayName = "Home";
