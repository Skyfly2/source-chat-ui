import { Alert, Box } from "@mui/material";
import React, { memo, useCallback, useState } from "react";
import { ChatHeader } from "../components/common/ChatHeader";
import { ChatInput } from "../components/common/ChatInput";
import { MessagesList } from "../components/common/MessagesList";
import { Sidebar } from "../components/common/Sidebar";
import { WelcomeScreen } from "../components/common/WelcomeScreen";
import { useChat } from "../hooks/useChat";
import { useModels } from "../hooks/useModels";
import { ConversationThread } from "../types";

export const Home: React.FC = memo(() => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<ConversationThread[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);

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
    refreshModels,
  } = useModels();

  const generateConversationTitle = useCallback((message: string): string => {
    const words = message.split(" ");
    if (words.length <= 6) return message;
    return words.slice(0, 6).join(" ") + "...";
  }, []);

  const handleSendMessage = useCallback(
    async (message: string) => {
      let conversationId = currentConversationId;

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

      if (conversationId) {
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
    ]
  );

  const handleNewChat = useCallback(() => {
    clearMessages();
    setCurrentConversationId(null);
    setSidebarOpen(false);
  }, [clearMessages]);

  const handleSelectConversation = useCallback((id: string) => {
    setCurrentConversationId(id);
    setSidebarOpen(false);
  }, []);

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

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

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
        open={sidebarOpen}
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
            return sidebarOpen && isDesktop ? "280px" : "0";
          },
        }}
      >
        <ChatHeader
          onToggleSidebar={toggleSidebar}
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

          <WelcomeScreen
            show={showWelcome}
            models={models}
            modelDetails={modelDetails}
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            modelsLoading={modelsLoading}
          />

          {hasMessages && (
            <MessagesList messages={messages} isStreaming={isStreaming} />
          )}

          <Box sx={{ py: 2, px: { xs: 2, sm: 3, md: 4 } }}>
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={modelsLoading || !selectedModel}
              isStreaming={isStreaming}
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
