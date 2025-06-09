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
import { ConversationThread } from "../types";

export const Home: React.FC = memo(() => {
  const [conversations, setConversations] = useState<ConversationThread[]>([]);
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
    models,
    modelDetails,
    selectedModel,
    isLoading: modelsLoading,
    error: modelsError,
    setSelectedModel,
    refreshModels: _refreshModels,
  } = useModels();

  const generateConversationTitle = useCallback((message: string): string => {
    const words = message.split(" ");
    if (words.length <= 6) return message;
    return words.slice(0, 6).join(" ") + "...";
  }, []);

  const handleSendMessage = useCallback(
    async (message: string) => {
      let conversationId = currentConversationId;

      // If we don't have a conversation but have a thread ID from global state, use that
      if (!conversationId && state.chat.currentThreadId) {
        conversationId = state.chat.currentThreadId;
        setCurrentConversationId(conversationId);
      }

      // Create new conversation if we don't have one and no messages
      if (!conversationId && !messages.length) {
        conversationId = `conv_${Date.now()}`;
        const newConversation: ConversationThread = {
          id: conversationId,
          title: generateConversationTitle(message),
          lastMessage: message,
          timestamp: new Date(),
          messages: [],
        };
        setConversations((prev) => [newConversation, ...prev]);
        setCurrentConversationId(conversationId);
      }

      await sendMessage(message, selectedModel);

      // After sending, if we got a thread ID from the server and don't have a conversation ID yet,
      // create the conversation with the server-provided thread ID
      if (state.chat.currentThreadId && !currentConversationId) {
        const serverThreadId = state.chat.currentThreadId;
        const newConversation: ConversationThread = {
          id: serverThreadId,
          title: generateConversationTitle(message),
          lastMessage: message,
          timestamp: new Date(),
          messages: [],
        };
        setConversations((prev) => [newConversation, ...prev]);
        setCurrentConversationId(serverThreadId);
      } else if (conversationId) {
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === conversationId
              ? { ...conv, lastMessage: message, timestamp: new Date() }
              : conv
          )
        );
      }
    },
    [
      sendMessage,
      selectedModel,
      currentConversationId,
      messages.length,
      generateConversationTitle,
      state.chat.currentThreadId,
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
    },
    [setSidebarOpen, setCurrentThread]
  );

  const handleDeleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => prev.filter((conv) => conv.id !== id));
      if (currentConversationId === id) {
        handleNewChat();
      }
    },
    [currentConversationId, handleNewChat]
  );

  const handleRenameConversation = useCallback(
    (id: string, newTitle: string) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === id ? { ...conv, title: newTitle } : conv
        )
      );
    },
    []
  );

  const currentConversation = conversations.find(
    (conv) => conv.id === currentConversationId
  );
  const hasMessages = messages.length > 0;
  const showWelcome = !hasMessages && !isLoading;

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
            : "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
        minHeight: "100vh",
      }}
    >
      <Sidebar
        open={state.sidebar.isOpen}
        onClose={() => setSidebarOpen(false)}
        conversations={conversations}
        currentConversationId={currentConversationId || undefined}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
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
        />

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Error Display */}
          {(error || modelsError) && (
            <Box
              sx={{
                py: 1.5,
                px: { xs: 2, sm: 3, md: 4 },
                maxWidth: { xs: "100%", md: "90%", lg: "80%", xl: "70%" },
                mx: "auto",
                width: "100%",
              }}
            >
              <Alert
                severity="error"
                onClose={() => {
                  clearError();
                }}
                sx={{
                  fontSize: "0.9rem",
                  "& .MuiAlert-message": { py: 0.5 },
                }}
              >
                {error || modelsError}
              </Alert>
            </Box>
          )}

          <WelcomeScreen show={showWelcome} />

          {hasMessages && (
            <MessagesList messages={messages} isStreaming={isStreaming} />
          )}

          <Box
            sx={{
              py: 2,
              px: { xs: 0.5, sm: 1, md: 1 },
              flexShrink: 0,
              position: "relative",
              zIndex: 1,
            }}
          >
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={modelsLoading || !selectedModel}
              isStreaming={isStreaming}
              models={models}
              modelDetails={modelDetails}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              modelsLoading={modelsLoading}
              placeholder={
                modelsLoading
                  ? "Loading models..."
                  : !selectedModel
                  ? "Select a model to start chatting"
                  : "Message Source Chat..."
              }
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
});

Home.displayName = "Home";
