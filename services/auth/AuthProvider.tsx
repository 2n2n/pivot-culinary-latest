import { getAuth, onAuthStateChanged } from "@react-native-firebase/auth";
import { useRouter, useSegments } from "expo-router";
import { createContext, useEffect } from "react";
import { useState } from "react";

const isGuest = (pathSegments: string[]) => {
  return pathSegments.some((segment) => {
    const AUTHORIZED_ROUTES = ["landing", "(auth)"];
    return AUTHORIZED_ROUTES.includes(segment);
  });
};
/**
 * AuthProvider and AuthContext
 *
 * This provider will be used in _layout.tsx as a wrapper to handle all authentication-related state and logic.
 * Wrap your app or layout with <AuthProvider> to provide authentication state and actions to the component tree.
 */
type AuthContextType = {
  user: Record<string, any> | null;
  setUser: (user: Record<string, any> | null) => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Record<string, any> | null>(null);

  // useSegments returns an array of the current route's path segments, e.g. ['(auth)', 'otp']
  const pathSegments = useSegments();

  const router = useRouter();

  useEffect(() => {
    const subscriber = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setUser(user);
        router.replace("/(application)/(tabs)/agenda");
      } else {
        if (!isGuest(pathSegments || [])) {
          // Redirect unauthenticated users to auth screen if not on guest routes
          router.replace("/landing");
        }
      }
    });
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
