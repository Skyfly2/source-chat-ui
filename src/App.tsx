import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AppThemeProvider } from "./contexts/ThemeContext";
import { Home } from "./pages/Home";

export const App: React.FC = () => {
  return (
    <AppThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </AppThemeProvider>
  );
};
