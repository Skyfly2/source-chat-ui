import { Chat, Group, Settings } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import React from "react";

export const Home: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          align="center"
          sx={{ mb: 2, fontWeight: 300 }}
        >
          Welcome to T3 Clone
        </Typography>

        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          A modern chat application built with React, TypeScript, and
          Material-UI
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: "center", p: 3 }}>
                <Chat sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Real-time Chat
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Instant messaging with real-time updates and modern interface
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: "center", p: 3 }}>
                <Group sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Channels & Groups
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Organize conversations in channels and manage group chats
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: "center", p: 3 }}>
                <Settings sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Customizable
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Dark/light themes and personalized settings for the best
                  experience
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Button
            variant="contained"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
            }}
          >
            Get Started
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
