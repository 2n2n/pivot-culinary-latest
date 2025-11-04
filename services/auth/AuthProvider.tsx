import { getAuth, onAuthStateChanged } from "@react-native-firebase/auth";
import { useRouter } from "expo-router";
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
  const router = useRouter();

  useEffect(() => {
    const subscriber = onAuthStateChanged(getAuth(), (_user) => {
      console.log("~_user has changed", _user);
      if (_user) {
        // if there is a user in the current session, check if the app state has a user.
        if (!user) {
          setUser(_user);
          console.log("~user was set to", _user, user);
        } else {
          // if the app state has a user, make sure to check if the user is the same with the _user.
          if (user?.uid !== _user.uid) {
            console.log(
              "~user was set to",
              _user,
              "because it was different from the current user"
            );
            setUser(_user);
          }
        }
      } else {
        // if the authStateChanged state doesn't have any user, redirect to landing page
        router.replace("/landing");
      }
    });
    return () => {
      subscriber();
    }; // unsubscribe on unmount
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
