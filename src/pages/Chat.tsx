import { useUser } from "@clerk/clerk-react";
import { Box, Card, CardContent, Container, Typography } from "@mui/material";
import React from "react";

export const Chat: React.FC = () => {
  const { user } = useUser();

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          align="center"
          sx={{ mb: 4, fontWeight: 300 }}
        >
          Welcome to Chat, {user?.firstName}!
        </Typography>

        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
              Chat Interface Coming Soon
            </Typography>
            <Typography variant="body1" color="text.secondary">
              This is a protected page that requires authentication. You're
              seeing this because you're signed in as{" "}
              {user?.emailAddresses[0]?.emailAddress}.
            </Typography>
            <Box
              sx={{
                mt: 3,
                p: 2,
                bgcolor: "background.default",
                borderRadius: 1,
              }}
            >
              <Typography variant="body2">
                <strong>User Info:</strong>
                <br />
                Name: {user?.firstName} {user?.lastName}
                <br />
                Email: {user?.emailAddresses[0]?.emailAddress}
                <br />
                User ID: {user?.id}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};
