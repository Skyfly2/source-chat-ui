import { Close } from "@mui/icons-material";
import {
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

interface ThreadItemProps {
  id: string;
  title: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ThreadItem: React.FC<ThreadItemProps> = ({
  id,
  title,
  isSelected,
  onSelect,
  onDelete,
}) => {
  return (
    <ListItem disablePadding>
      <ListItemButton
        selected={isSelected}
        onClick={() => onSelect(id)}
        sx={{
          borderRadius: 1.5,
          mx: 0.5,
          my: 0.25,
          transition: "all 0.15s ease-out",
          "&.Mui-selected": {
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(148, 163, 184, 0.15)"
                : "rgba(148, 163, 184, 0.1)",
            "&:hover": {
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(148, 163, 184, 0.2)"
                  : "rgba(148, 163, 184, 0.15)",
            },
          },
          "&:hover": {
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(148, 163, 184, 0.08)"
                : "rgba(148, 163, 184, 0.05)",
          },
        }}
      >
        <ListItemText
          primary={title}
          primaryTypographyProps={{
            fontSize: "0.9rem",
            fontWeight: 500,
            noWrap: true,
          }}
        />
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          sx={{
            opacity: 0.5,
            color: "text.secondary",
            "&:hover": {
              opacity: 1,
              color: "error.main",
              background: "rgba(239, 68, 68, 0.05)",
            },
          }}
        >
          <Close fontSize="small" />
        </IconButton>
      </ListItemButton>
    </ListItem>
  );
};
