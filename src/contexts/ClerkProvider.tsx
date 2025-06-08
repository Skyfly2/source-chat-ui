import { ClerkProvider as ClerkAuthProvider } from "@clerk/clerk-react";
import React, { ReactNode } from "react";

interface ClerkProviderProps {
  children: ReactNode;
}

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("Missing Clerk Publishable Key");
}

export const ClerkProvider: React.FC<ClerkProviderProps> = ({ children }) => {
  return (
    <ClerkAuthProvider publishableKey={publishableKey}>
      {children}
    </ClerkAuthProvider>
  );
};
