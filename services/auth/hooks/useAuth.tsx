import { useContext } from "react";
import { signInWithPhoneNumber, getAuth } from "@react-native-firebase/auth";
import crashlytics from "@react-native-firebase/crashlytics";
import { AuthContext } from "@/services/auth/AuthProvider";
import formatPhoneNumber from "@/utils/helpers/format-phone-number";

const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);

  const signIn = (phoneNumber: string) => {
    return signInWithPhoneNumber(getAuth(), formatPhoneNumber(phoneNumber))
      .then((result) => console.log(result))
      .catch((error) => console.log(error));
    // try {
    //   return
    // } catch (error) {
    //   crashlytics().recordError(error);
    //   throw error;
    // }
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
