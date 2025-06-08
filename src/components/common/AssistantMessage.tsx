import { Box, Typography } from "@mui/material";
import { memo } from "react";

interface AssistantMessageProps {
  content: string;
  isStreaming?: boolean;
}

export const AssistantMessage = memo<AssistantMessageProps>(
  ({ content, isStreaming }) => {
    return (
      <Box
        sx={{
          py: 2,
          px: 0,
          animation: "slideUp 0.3s ease-out",
          "&:last-child": {
            borderBottom: "none",
          },
        }}
      >
        <Typography
          variant="body1"
          sx={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            lineHeight: 1.65,
            color: "text.primary",
            fontSize: "0.95rem",
            fontWeight: 400,
          }}
        >
          {content || (isStreaming ? "" : "")}
          {/* Streaming indicator - inline at end of text */}
          {isStreaming && (
            <Box
              component="span"
              sx={{
                display: "inline-block",
                width: 2,
                height: 18,
                bgcolor: "primary.main",
                ml: 0.5,
                borderRadius: 1,
                animation: "pulse 1.2s ease-in-out infinite",
                verticalAlign: "text-bottom",
                willChange: "opacity",
              }}
            />
          )}
        </Typography>
      </Box>
    );
  }
);

AssistantMessage.displayName = "AssistantMessage";
