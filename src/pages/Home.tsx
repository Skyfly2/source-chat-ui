import { Alert, Box } from "@mui/material";
import React, { memo, useCallback } from "react";
import { ChatHeader } from "../components/common/ChatHeader";
import { ChatInput } from "../components/common/ChatInput";
import { MessagesList } from "../components/common/MessagesList";
import { WelcomeScreen } from "../components/common/WelcomeScreen";
import { useChat } from "../hooks/useChat";
import { useModels } from "../hooks/useModels";

export const Home: React.FC = memo(() => {
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

  const handleSendMessage = useCallback(
    async (message: string) => {
      await sendMessage(message, selectedModel);
    },
    [sendMessage, selectedModel]
  );

  const hasMessages = messages.length > 0;
  const showWelcome = !hasMessages && !isLoading;

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
            : "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
        minHeight: "100vh",
      }}
    >
      <ChatHeader
        models={models}
        modelDetails={modelDetails}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        modelsLoading={modelsLoading}
        isStreaming={isStreaming}
        hasMessages={hasMessages}
        onRefreshModels={refreshModels}
        onClearMessages={clearMessages}
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
  );
});

Home.displayName = "Home";
