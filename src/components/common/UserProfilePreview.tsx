import { SignOutButton, useUser } from "@clerk/clerk-react";
import { Logout } from "@mui/icons-material";
import { Avatar, Box, IconButton, Typography } from "@mui/material";

export const UserProfilePreview: React.FC = () => {
  const { user } = useUser();

  if (!user) {
    return (
      <Typography
        variant="caption"
        sx={{
          color: "text.secondary",
          fontSize: "0.7rem",
          textAlign: "center",
          display: "block",
        }}
      >
        Source Chat
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Avatar
        src={user.imageUrl}
        alt={user.fullName || user.firstName || "User"}
        sx={{ width: 32, height: 32 }}
      />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="subtitle2"
          noWrap
          sx={{
            fontWeight: 600,
            fontSize: "0.8rem",
            color: "text.primary",
          }}
        >
          {user.fullName || user.firstName || "User"}
        </Typography>
        <Typography
          variant="caption"
          noWrap
          sx={{
            color: "text.secondary",
            fontSize: "0.7rem",
          }}
        >
          {user.primaryEmailAddress?.emailAddress}
        </Typography>
      </Box>
      <SignOutButton>
        <IconButton
          size="small"
          sx={{
            color: "text.secondary",
            "&:hover": {
              color: "error.main",
              background: "rgba(239, 68, 68, 0.05)",
            },
          }}
        >
          <Logout fontSize="small" />
        </IconButton>
      </SignOutButton>
    </Box>
  );
};
