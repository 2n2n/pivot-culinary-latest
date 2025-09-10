import React, { useState } from "react";
import { View } from "react-native";
import { Input, InputField } from "../../components/ui/input";
import { Button, ButtonText } from "../../components/ui/button";
import { Box } from "../../components/ui/box";
import { Text } from "../../components/ui/text";
import { useRouter } from "expo-router";

function AuthLoginScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleLogin = () => {
    console.log("Login attempted with:", phoneNumber);
    router.navigate("/(auth)/otp");
  };

  return (
    <Box className="flex-1 justify-center items-center px-6 bg-background-0">
      <Box className="w-full max-w-sm space-y-6 items-center">
        <Text size="4xl" bold className="text-typography-900 mb-8">
          Pivot Culinary
        </Text>

        <Text size="md" className="text-typography-600 text-center mb-8">
          Sign in to your account to continue
        </Text>

        <Input size="lg" variant="outline" className="w-full mb-4">
          <InputField
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </Input>

        <Button
          size="lg"
          variant="solid"
          action="primary"
          onPress={handleLogin}
          className="w-full"
          isDisabled={!phoneNumber.trim()}
        >
          <ButtonText>Sign In</ButtonText>
        </Button>
      </Box>
    </Box>
  );
}

export default AuthLoginScreen;
