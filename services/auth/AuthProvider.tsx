import { createContext } from "react";
import { useState } from "react";

/**
 * AuthProvider and AuthContext
 *
 * This provider will be used in _layout.tsx as a wrapper to handle all authentication-related state and logic.
 * Wrap your app or layout with <AuthProvider> to provide authentication state and actions to the component tree.
 */
export const AuthContext = createContext({
  user: null,
  setUser: (user: Record<string, any> | null) => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Record<string, any> | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
