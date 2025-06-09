import { Box, Typography } from "@mui/material";
import "highlight.js/styles/github-dark.css";
import { memo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

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
        <Box
          sx={{
            color: "text.primary",
            fontSize: "0.95rem",
            fontWeight: 400,
            lineHeight: 1.65,
            "& p": {
              margin: "0.75em 0",
              "&:first-of-type": {
                marginTop: 0,
              },
              "&:last-of-type": {
                marginBottom: 0,
              },
            },
            "& h1, & h2, & h3, & h4, & h5, & h6": {
              fontWeight: 600,
              marginTop: "1.5em",
              marginBottom: "0.5em",
              "&:first-of-type": {
                marginTop: 0,
              },
            },
            "& h1": { fontSize: "1.5em" },
            "& h2": { fontSize: "1.3em" },
            "& h3": { fontSize: "1.1em" },
            "& h4, & h5, & h6": { fontSize: "1em" },
            "& ul, & ol": {
              margin: "0.75em 0",
              paddingLeft: "1.5em",
            },
            "& li": {
              margin: "0.25em 0",
            },
            "& blockquote": {
              borderLeft: "3px solid",
              borderColor: "primary.main",
              paddingLeft: "1em",
              margin: "1em 0",
              fontStyle: "italic",
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(148, 163, 184, 0.05)"
                  : "rgba(148, 163, 184, 0.03)",
              borderRadius: "0 4px 4px 0",
              py: 0.5,
            },
            "& code": {
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(148, 163, 184, 0.15)"
                  : "rgba(148, 163, 184, 0.1)",
              padding: "0.125em 0.25em",
              borderRadius: "3px",
              fontSize: "0.9em",
              fontFamily:
                "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
            },
            "& pre": {
              background: (theme) =>
                theme.palette.mode === "dark" ? "#1e293b" : "#f8fafc",
              border: "1px solid",
              borderColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(148, 163, 184, 0.1)"
                  : "rgba(148, 163, 184, 0.2)",
              borderRadius: "6px",
              padding: "1em",
              margin: "1em 0",
              overflow: "auto",
              fontSize: "0.85em",
              lineHeight: 1.5,
              "& code": {
                background: "none",
                padding: 0,
                fontSize: "inherit",
              },
            },
            "& table": {
              width: "100%",
              borderCollapse: "collapse",
              margin: "1em 0",
              border: "1px solid",
              borderColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(148, 163, 184, 0.2)"
                  : "rgba(148, 163, 184, 0.3)",
              borderRadius: "6px",
              overflow: "hidden",
            },
            "& th, & td": {
              padding: "0.75em",
              borderBottom: "1px solid",
              borderColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(148, 163, 184, 0.1)"
                  : "rgba(148, 163, 184, 0.15)",
              textAlign: "left",
            },
            "& th": {
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(148, 163, 184, 0.1)"
                  : "rgba(148, 163, 184, 0.05)",
              fontWeight: 600,
            },
            "& a": {
              color: "primary.main",
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            },
            "& hr": {
              border: "none",
              borderTop: "1px solid",
              borderColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(148, 163, 184, 0.2)"
                  : "rgba(148, 163, 184, 0.3)",
              margin: "1.5em 0",
            },
          }}
        >
          {content ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                // Ensure code blocks use proper highlighting
                code: ({ className, children, ...props }) => (
                  <code className={className} {...props}>
                    {children}
                  </code>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          ) : isStreaming ? (
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", fontStyle: "italic" }}
            >
              Thinking...
            </Typography>
          ) : null}

          {/* Streaming indicator - inline at end of text */}
          {isStreaming && content && (
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
        </Box>
      </Box>
    );
  }
);

AssistantMessage.displayName = "AssistantMessage";
