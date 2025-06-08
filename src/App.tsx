import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/auth";
import { Layout } from "./components/layout";
import { ClerkProvider } from "./contexts/ClerkProvider";
import { AppThemeProvider } from "./contexts/ThemeContext";
import { Chat } from "./pages/Chat";
import { Home } from "./pages/Home";

export const App: React.FC = () => {
  return (
    <ClerkProvider>
      <AppThemeProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Layout>
        </Router>
      </AppThemeProvider>
    </ClerkProvider>
  );
};
