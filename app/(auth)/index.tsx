import React, { useState } from "react";
import { Input, InputField } from "../../components/ui/input";
import { Button, ButtonText } from "../../components/ui/button";
import { Box } from "../../components/ui/box";
import { Text } from "../../components/ui/text";
import { Stack, useRouter } from "expo-router";
import { Icon } from "@/components/ui/icon";
import PivotIcon from "@/components/SvgIcons/PivotIcon";
import { VStack } from "@/components/ui/vstack";
import GamedayLoadingIndicator from "@/components/LoadingIndicator/GamedayLoadingIndicator";

// TODO: Polish this screen, where it should animate the initial state of the phone number into the active state
function AuthLoginScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleLogin = () => {
    router.push({
      pathname: "/(auth)/otp",
      params: { phoneNumber },
    });
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Box className="flex-1 justify-center items-center px-6 bg-gameday-blue">
        <GamedayLoadingIndicator size={100} />
        {/* <VStack className="w-full max-w-sm gap-12">
          <VStack className="items-center gap-4">
            <Icon as={PivotIcon} className="h-14 w-14" />
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
        </VStack> */}
      </Box>
    </>
  );
}

export default AuthLoginScreen;
