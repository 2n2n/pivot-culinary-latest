import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Sign In",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="otp"
        options={{
          title: "OTP Verification",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
