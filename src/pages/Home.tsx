import { Alert, Box } from "@mui/material";
import React, { memo, useCallback, useState } from "react";
import { ChatHeader } from "../components/common/ChatHeader";
import { ChatInput } from "../components/common/ChatInput";
import { MessagesList } from "../components/common/MessagesList";
import { Sidebar } from "../components/common/Sidebar";
import { WelcomeScreen } from "../components/common/WelcomeScreen";
import { useChat } from "../hooks/useChat";
import { useChatState } from "../hooks/useChatState";
import { useModels } from "../hooks/useModels";
import { useThreads } from "../hooks/useThreads";

export const Home: React.FC = memo(() => {
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);

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
    conversations,
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

  const handleSendMessage = useCallback(
    async (message: string) => {
      // The useChat hook now handles thread creation and management automatically
      await sendMessage(message, selectedModel);

      // Update the current conversation ID if we got a new thread from global state
      if (state.chat.currentThreadId && !currentConversationId) {
        setCurrentConversationId(state.chat.currentThreadId);
        // Refresh threads to get the newly created thread
        await refreshThreads();
      }
    },
    [
      sendMessage,
      selectedModel,
      state.chat.currentThreadId,
      currentConversationId,
      refreshThreads,
    ]
  );

  const handleNewChat = useCallback(() => {
    clearMessages(); // This will also clear the current thread in global state
    setCurrentConversationId(null);
    setSidebarOpen(false);
  }, [clearMessages, setSidebarOpen]);

  const handleSelectConversation = useCallback(
    (id: string) => {
      setCurrentConversationId(id);
      setCurrentThread(id); // Set the thread ID in global state
      setSidebarOpen(false);

      // Messages will automatically be loaded from global state based on thread ID
      // No need to manually load here as useChat hook handles this via useMemo
    },
    [setSidebarOpen, setCurrentThread]
  );

  const handleDeleteConversation = useCallback(
    async (id: string) => {
      try {
        await deleteThread(id);
        if (currentConversationId === id) {
          handleNewChat();
        }
      } catch (err) {
        // Error is already handled in useThreads hook
        console.error("Failed to delete thread:", err);
      }
    },
    [currentConversationId, handleNewChat, deleteThread]
  );

  const handleRenameConversation = useCallback(
    async (id: string, newTitle: string) => {
      try {
        await updateThreadTitle(id, newTitle);
      } catch (err) {
        // Error is already handled in useThreads hook
        console.error("Failed to rename thread:", err);
      }
    },
    [updateThreadTitle]
  );

  const currentConversation = conversations.find(
    (conv) => conv.id === (currentConversationId || state.chat.currentThreadId)
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
        conversations={conversations}
        currentConversationId={
          currentConversationId || state.chat.currentThreadId || undefined
        }
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
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
          currentConversationTitle={currentConversation?.title || undefined}
          onNewThread={handleNewChat}
          sidebarOpen={state.sidebar.isOpen}
        />

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
            paddingBottom: "120px", // Space for fixed input at bottom
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
              placeholder={
                modelsLoading
                  ? "Loading models..."
                  : !selectedModel
                  ? "Select a model to start chatting"
                  : "Message Source Chat..."
              }
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
