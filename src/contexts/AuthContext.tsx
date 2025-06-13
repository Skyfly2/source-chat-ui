import { useAuth } from "@clerk/clerk-react";
import React, { createContext, useContext } from "react";

interface AuthContextType {
  isSignedIn: boolean;
  isLoading: boolean;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isSignedIn, isLoaded, getToken } = useAuth();

  const contextValue: AuthContextType = {
    isSignedIn: isSignedIn || false,
    isLoading: !isLoaded,
    getToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
