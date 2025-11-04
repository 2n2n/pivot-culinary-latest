import React, { useState, useRef } from "react";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Icon } from "@/components/ui/icon";
import PivotIcon from "@/components/SvgIcons/PivotIcon";
import { VStack } from "@/components/ui/vstack";
import AppAdaptiveLogo from "./shared/AppAdaptiveLogo";

interface AuthOTPFormProps {
  isSubmitting: boolean;
  onSubmitHandler: (otp: string) => void;
  onResendHandler: () => void;
}

export default function AuthOTPForm({
  isSubmitting = false,
  onSubmitHandler,
  onResendHandler,
}: AuthOTPFormProps) {
  const { phoneNumber } = useLocalSearchParams();

  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<Array<any>>([]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace to go to previous input
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <Box className="flex-1">
      <Box className="absolute top-12 left-6 z-10">
        <Button
          size="sm"
          variant="outline"
          action="secondary"
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full"
        >
          <Ionicons name="chevron-back" size={20} color="#0000" />
        </Button>
      </Box>

      {/* Main Content */}
      <Box className="flex-1 justify-center items-center px-6">
        <VStack className="w-full max-w-sm gap-8 items-center">
          <VStack className="items-center gap-4">
            <AppAdaptiveLogo size="lg" />
            <VStack className="items-center gap-2">
              <Text bold className="text-typography-900">
                Verify Phone
              </Text>

              <Text size="md" className="text-typography-600 text-center">
                Enter the 6-digit code sent to {phoneNumber}
              </Text>
            </VStack>
          </VStack>

          <Box className="w-full flex-row justify-between">
            {otp.map((digit, index) => (
              <Input
                key={index}
                size="lg"
                variant="outline"
                className="w-12 h-12 mx-1"
              >
                <InputField
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  placeholder=""
                  keyboardType="numeric"
                  maxLength={1}
                  textAlign="center"
                  className="text-center text-lg font-bold rounded-full"
                />
              </Input>
            ))}
          </Box>

          <Button
            size="lg"
            variant="solid"
            action="primary"
            onPress={() => onSubmitHandler(otp.join(""))}
            className="w-full rounded-full"
            isDisabled={!isOtpComplete || isSubmitting}
          >
            <ButtonText>Verify OTP</ButtonText>
          </Button>

          <Box className="flex-row items-center justify-center mt-4">
            <Text size="sm" className="text-typography-500">
              Didn't receive the code?{" "}
            </Text>
            <Button
              size="sm"
              variant="link"
              action="primary"
              onPress={onResendHandler}
            >
              <ButtonText>Resend</ButtonText>
            </Button>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}
