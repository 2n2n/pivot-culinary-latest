import React, { useState } from "react";
import { Input, InputField } from "../../components/ui/input";
import { Button, ButtonText } from "../../components/ui/button";
import { Box } from "../../components/ui/box";
import { Text } from "../../components/ui/text";
import { Stack } from "expo-router";
import { Icon } from "@/components/ui/icon";
import PivotIcon from "@/components/SvgIcons/PivotIcon";
import { VStack } from "@/components/ui/vstack";
import useAuth from "@/services/auth/hooks/useAuth";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import AuthOTPForm from "@/components/OtpForm";
import AppAdaptiveLogo from "@/components/shared/AppAdaptiveLogo";

/**
 * AUTHENTICATION FLOW OVERVIEW
 * =============================
 *
 * This React Native app implements a Firebase Authentication flow using phone number verification.
 * The authentication system is built around Firebase Auth with phone-based OTP verification.
 *
 * FLOW STEPS:
 * -----------
 *
 * 1. APP INITIALIZATION
 *    - App starts at index.tsx which redirects to /landing
 *    - Landing page shows app branding and "Sign In" button
 *    - User taps "Sign In" → navigates to /(auth)/auth
 *
 * 2. PHONE NUMBER INPUT
 *    - User enters phone number in auth.tsx
 *    - useAuth hook formats phone number and calls Firebase signInWithPhoneNumber()
 *    - Firebase sends OTP to the provided phone number
 *    - Returns ConfirmationResult object for OTP verification
 *    - UI switches to AuthOTPForm component for OTP entry
 *
 * 3. OTP VERIFICATION
 *    - User enters 6-digit OTP in AuthOTPForm component
 *    - OTP is submitted via authResponse.confirm(code)
 *    - Firebase verifies the OTP code
 *
 * 4. AUTHENTICATION STATE MANAGEMENT
 *    - AuthProvider wraps the entire app in _layout.tsx
 *    - Uses Firebase onAuthStateChanged listener to monitor auth state
 *    - When user successfully authenticates:
 *      - Firebase user object is set in AuthContext
 *      - User is automatically redirected to /(application)/agenda
 *    - When user is not authenticated:
 *      - If not on authorized routes, redirects to /(auth)/auth
 *
 * 5. ROUTE PROTECTION
 *    - isAuthorizedPath() function checks if current route is protected
 *    - Authorized routes: ["(application)"]
 *    - Unauthorized users are redirected to auth flow
 *    - Authenticated users accessing auth routes are redirected to app
 *
 * 6. PERSISTENT AUTHENTICATION
 *    - Firebase Auth handles session persistence automatically
 *    - onAuthStateChanged listener fires on app restart
 *    - User remains logged in across app sessions
 *
 * KEY COMPONENTS:
 * ---------------
 * - AuthProvider: Manages global auth state and route protection
 * - useAuth hook: Provides signIn/signOut functions
 * - AuthOTPForm: Handles OTP input and verification UI
 * - Firebase Auth: Backend authentication service
 *
 * SECURITY FEATURES:
 * ------------------
 * - Phone number validation and formatting
 * - OTP-based verification (time-limited codes)
 * - Automatic session management
 * - Route-based access control
 * - Error logging via Firebase Crashlytics
 *
 * ERROR HANDLING:
 * ---------------
 * - Sign-in errors are caught and logged to Crashlytics
 * - Invalid OTP codes are handled by Firebase Auth
 * - Network errors during OTP sending are handled gracefully
 */

// TODO: Polish this screen, where it should animate the initial state of the phone number into the active state
function AuthLoginScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [authResponse, setAuthResponse] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const { signIn } = useAuth();

  async function handleLogin() {
    try {
      setIsSubmitting(true);
      const response = await signIn(phoneNumber);
      setAuthResponse(response);
    } catch (error) {
      // TODO: Add handler for error message here.
      console.log("error when signing in", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onSubmitOTP(code: string) {
    authResponse?.confirm(code);
  }

  async function onResendOTP() {}

  if (!authResponse) {
    return (
      <>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <Box className="flex-1 justify-center items-center px-6">
          <VStack className="w-full max-w-sm gap-8">
            <VStack className="items-center gap-4">
              <AppAdaptiveLogo size="lg" />
              <Text size="md" className="font-bold text-center">
                Login to your account
              </Text>
            </VStack>

            <VStack className="flex gap-4">
              <Input
                size="lg"
                variant="outline"
                className="w-full rounded-full px-4"
              >
                <InputField
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
              </Input>
              <Button
                disabled={isSubmitting}
                size="lg"
                variant="solid"
                action="primary"
                onPress={handleLogin}
                className="w-ful rounded-full"
                isDisabled={!phoneNumber.trim()}
              >
                <ButtonText>Sign In</ButtonText>
              </Button>
            </VStack>
          </VStack>
        </Box>
      </>
    );
  } else {
    return (
      <AuthOTPForm
        onSubmitHandler={onSubmitOTP}
        onResendHandler={onResendOTP}
      />
    );
  }
}

export default AuthLoginScreen;
