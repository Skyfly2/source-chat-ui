import { Clear, Refresh } from "@mui/icons-material";
import { Alert, Box, Fade, IconButton, Typography } from "@mui/material";
import React, { memo, useCallback, useEffect, useRef } from "react";
import { ChatBubble } from "../components/common/ChatBubble";
import { ChatInput } from "../components/common/ChatInput";
import { ModelSelector } from "../components/common/ModelSelector";
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

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

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
      {/* Subtle Header with Gradient */}
      <Box
        sx={{
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.9) 100%)"
              : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.95) 100%)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid",
          borderColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(148, 163, 184, 0.1)"
              : "rgba(148, 163, 184, 0.15)",
        }}
      >
        <Box
          sx={{
            maxWidth: {
              xs: "100%",
              sm: "100%",
              md: "90%",
              lg: "80%",
              xl: "70%",
            },
            mx: "auto",
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              py: 1.5,
              gap: 2,
            }}
          >
            <Typography
              variant="h6"
              component="h1"
              sx={{
                fontWeight: 600,
                color: "text.primary",
                fontSize: "1.1rem",
                letterSpacing: "-0.01em",
              }}
            >
              Source Chat
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ModelSelector
                models={models}
                modelDetails={modelDetails}
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
                disabled={modelsLoading || isStreaming}
              />

              <IconButton
                onClick={refreshModels}
                disabled={modelsLoading}
                size="small"
                sx={{
                  color: "text.secondary",
                  transition: "all 0.15s ease-out",
                  "&:hover": {
                    transform: "rotate(90deg)",
                    color: "primary.main",
                  },
                }}
              >
                <Refresh fontSize="small" />
              </IconButton>

              {hasMessages && (
                <IconButton
                  onClick={clearMessages}
                  disabled={isStreaming}
                  size="small"
                  sx={{
                    color: "text.secondary",
                    transition: "all 0.15s ease-out",
                    "&:hover": {
                      color: "error.main",
                      transform: "scale(1.1)",
                    },
                  }}
                >
                  <Clear fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Main Chat Area */}
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

        {/* Welcome Screen with Subtle Animation */}
        {showWelcome && (
          <Fade in={showWelcome} timeout={600}>
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                gap: 3,
                py: 6,
                px: { xs: 2, sm: 3, md: 4 },
                animation: "fadeIn 0.8s ease-out",
              }}
            >
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  fontWeight: 400,
                  fontSize: { xs: "1.8rem", sm: "2rem", md: "2.2rem" },
                  mb: 2,
                  maxWidth: "600px",
                  background: (theme) =>
                    theme.palette.mode === "dark"
                      ? "linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%)"
                      : "linear-gradient(135deg, #0f172a 0%, #64748b 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                How can I help you today?
              </Typography>
            </Box>
          </Fade>
        )}

        {/* Messages Area with Performance Optimization */}
        {hasMessages && (
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              py: 0,
              px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 },
              maxWidth: "100%",
              willChange: "scroll-position",
              "&::-webkit-scrollbar": {
                width: 4,
              },
              "&::-webkit-scrollbar-track": {
                bgcolor: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(148, 163, 184, 0.3)"
                    : "rgba(148, 163, 184, 0.4)",
                borderRadius: 2,
              },
            }}
          >
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                message={message}
                isStreaming={
                  isStreaming &&
                  message.role === "assistant" &&
                  message === messages[messages.length - 1]
                }
              />
            ))}
            <div ref={messagesEndRef} />
          </Box>
        )}

        {/* Input Area with Gradient */}

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
