import { useContext } from "react";
import { AuthContext } from "@/services/auth/AuthProvider";

const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);

  const signIn = (phoneNumber: string) => {
    // Implement signIn logic here, possibly using authContext
  };

  const signOut = () => {
    // Implement signOut logic here, possibly using authContext
  };

  return {
    signIn,
    signOut,
  };
};

export default useAuth;
