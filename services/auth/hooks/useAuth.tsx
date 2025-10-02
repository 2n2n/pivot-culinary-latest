import { useContext } from "react";
import { signInWithPhoneNumber, getAuth } from "@react-native-firebase/auth";
import crashlytics from "@react-native-firebase/crashlytics";
import { AuthContext } from "@/services/auth/AuthProvider";
import formatPhoneNumber from "@/utils/helpers/format-phone-number";
import { useRouter } from "expo-router";

const useAuth = () => {
  const router = useRouter();

  /**
   * Initiates the sign-in process using a phone number. automatic redirect to (auth)/otp
   *
   * - Formats the provided phone number.
   * - Uses Firebase Auth to send an OTP to the formatted phone number.
   * - Stores the auth response in the provided authResponseRef.
   * - Navigates the user to the OTP entry screen with the formatted phone number as a parameter.
   * - If authResponseRef is not initialized, throws an error.
   * - Records any errors to Crashlytics and rethrows them.
   *
   * @param phoneNumber - The user's phone number to sign in with.
   * @throws Error if authResponseRef is not initialized or if sign-in fails.
   */
  const signIn = async (phoneNumber: string) => {
    try {
      const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
      return await signInWithPhoneNumber(getAuth(), formattedPhoneNumber);
    } catch (error) {
      console.log(error);
      crashlytics().recordError(error);
      throw error;
    }
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
