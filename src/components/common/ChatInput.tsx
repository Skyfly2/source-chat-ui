import { Send, Stop } from "@mui/icons-material";
import { IconButton, InputBase, Paper } from "@mui/material";
import { KeyboardEvent, memo, useCallback, useState } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isStreaming?: boolean;
  placeholder?: string;
}

export const ChatInput = memo<ChatInputProps>(
  ({
    onSendMessage,
    disabled = false,
    isStreaming = false,
    placeholder = "Type your message...",
  }) => {
    const [message, setMessage] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const handleSend = useCallback(() => {
      if (message.trim() && !disabled && !isStreaming) {
        onSendMessage(message.trim());
        setMessage("");
      }
    }, [message, disabled, isStreaming, onSendMessage]);

    const handleKeyPress = useCallback(
      (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          handleSend();
        }
      },
      [handleSend]
    );

    const handleStop = useCallback(() => {
      console.log("Stop streaming requested");
    }, []);

    return (
      <Paper
        component="form"
        elevation={0}
        sx={{
          px: 1.5,
          py: 0.75,
          display: "flex",
          alignItems: "center",
          gap: 1,
          borderRadius: 3,
          maxWidth: { xs: "100%", sm: "600px", md: "700px" },
          mx: "auto",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(51, 65, 85, 0.9) 100%)"
              : "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.95) 100%)",
          border: "1px solid",
          borderColor: isFocused
            ? "primary.main"
            : (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(148, 163, 184, 0.15)"
                  : "rgba(148, 163, 184, 0.25)",
          backdropFilter: "blur(12px)",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0 4px 12px rgba(0, 0, 0, 0.25)"
              : "0 2px 8px rgba(0, 0, 0, 0.08)",
          transition: "all 0.15s ease-out",
          willChange: "border-color, box-shadow",
          "&:hover": {
            borderColor: "primary.light",
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 6px 16px rgba(0, 0, 0, 0.3)"
                : "0 4px 12px rgba(0, 0, 0, 0.12)",
          },
        }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <InputBase
          sx={{
            flex: 1,
            "& .MuiInputBase-input": {
              py: 0.5,
              px: 0,
              fontSize: "0.95rem",
              lineHeight: 1.5,
              fontWeight: 400,
              color: "text.primary",
              "&::placeholder": {
                color: "text.secondary",
                opacity: 0.7,
                fontWeight: 400,
              },
            },
          }}
          placeholder={placeholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          multiline
          maxRows={4}
          inputProps={{
            "aria-label": "chat message input",
            style: { resize: "none" },
          }}
        />

        {isStreaming ? (
          <IconButton
            onClick={handleStop}
            sx={{
              background:
                "linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.2) 100%)",
              color: "error.main",
              width: 32,
              height: 32,
              transition: "all 0.15s ease-out",
              "&:hover": {
                background:
                  "linear-gradient(135deg, rgba(239, 68, 68, 0.25) 0%, rgba(220, 38, 38, 0.3) 100%)",
                transform: "scale(1.05)",
              },
            }}
            size="small"
          >
            <Stop fontSize="small" />
          </IconButton>
        ) : (
          <IconButton
            onClick={handleSend}
            disabled={!message.trim() || disabled}
            sx={{
              background:
                message.trim() && !disabled
                  ? "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)"
                  : (theme) =>
                      theme.palette.mode === "dark"
                        ? "rgba(148, 163, 184, 0.1)"
                        : "rgba(148, 163, 184, 0.08)",
              color: message.trim() && !disabled ? "white" : "text.secondary",
              width: 32,
              height: 32,
              transition: "all 0.15s ease-out",
              willChange: "transform, background",
              "&:hover":
                message.trim() && !disabled
                  ? {
                      background:
                        "linear-gradient(135deg, #3730a3 0%, #4f46e5 100%)",
                      transform: "scale(1.05)",
                    }
                  : {},
              "&:disabled": {
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(148, 163, 184, 0.05)"
                    : "rgba(148, 163, 184, 0.05)",
                color: "action.disabled",
              },
            }}
            size="small"
          >
            <Send fontSize="small" />
          </IconButton>
        )}
      </Paper>
    );
  }
);

ChatInput.displayName = "ChatInput";
