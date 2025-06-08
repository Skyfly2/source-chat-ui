import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Layout } from "./components/layout";
import { AppThemeProvider } from "./contexts/ThemeContext";
import { Home } from "./pages/Home";

export const App: React.FC = () => {
  return (
    <AppThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Layout>
      </Router>
    </AppThemeProvider>
  );
};
