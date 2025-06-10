import { Add } from "@mui/icons-material";
import { Button } from "@mui/material";

interface NewChatButtonProps {
  onClick: () => void;
}

export const NewChatButton: React.FC<NewChatButtonProps> = ({ onClick }) => {
  return (
    <Button
      fullWidth
      startIcon={<Add />}
      onClick={onClick}
      sx={{
        py: 1,
        px: 2,
        borderRadius: 2,
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.9) 100%)"
            : "linear-gradient(135deg, rgba(241, 245, 249, 0.8) 0%, rgba(226, 232, 240, 0.9) 100%)",
        color: "text.primary",
        fontWeight: 500,
        fontSize: "0.9rem",
        textTransform: "none",
        border: "1px solid",
        borderColor: (theme) =>
          theme.palette.mode === "dark"
            ? "rgba(148, 163, 184, 0.15)"
            : "rgba(148, 163, 184, 0.2)",
        transition: "all 0.15s ease-out",
        "&:hover": {
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 1) 100%)"
              : "linear-gradient(135deg, rgba(241, 245, 249, 0.9) 0%, rgba(226, 232, 240, 1) 100%)",
          borderColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(148, 163, 184, 0.25)"
              : "rgba(148, 163, 184, 0.3)",
          transform: "translateY(-1px)",
        },
      }}
    >
      New Chat
    </Button>
  );
};
