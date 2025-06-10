import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AppThemeProvider } from "./contexts/ThemeContext";
import { Home } from "./pages/Home";

export const App: React.FC = () => {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </AuthProvider>
    </AppThemeProvider>
  );
};
