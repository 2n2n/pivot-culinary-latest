import { getAuth, onAuthStateChanged } from "@react-native-firebase/auth";
import { useRouter, useSegments } from "expo-router";
import { createContext, useEffect } from "react";
import { useState } from "react";

const isAuthorizedPath = (pathSegments: string[]) => {
  return pathSegments.some((segment) => {
    const AUTHORIZED_ROUTES = ["(application)"];
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
      console.log("onAuthStateChanged", user);

      if (user) {
        setUser(user);
        router.replace("/(application)/agenda");
      } else {
        if (!isAuthorizedPath(pathSegments || [])) {
          // BUGFIX: landing page should be a valid screen
          router.replace("/(auth)/auth");
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
