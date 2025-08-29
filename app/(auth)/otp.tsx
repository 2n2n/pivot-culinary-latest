import React, { useState, useRef } from "react";
import { View } from "react-native";
import { Input, InputField } from "../../components/ui/input";
import { Button, ButtonText } from "../../components/ui/button";
import { Box } from "../../components/ui/box";
import { Text } from "../../components/ui/text";

export default function OTPScreen() {
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

  const handleVerifyOTP = () => {
    const otpString = otp.join("");
    console.log("OTP verification attempted with:", otpString);
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <Box className="flex-1 justify-center items-center px-6 bg-background-0">
      <Box className="w-full max-w-sm space-y-6 items-center">
        <Text size="4xl" bold className="text-typography-900 mb-8">
          Verify OTP
        </Text>

        <Text size="md" className="text-typography-600 text-center mb-8">
          Enter the 6-digit code sent to your phone
        </Text>

        <Box className="w-full flex-row justify-between mb-8">
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
                className="text-center text-lg font-bold"
              />
            </Input>
          ))}
        </Box>

        <Button
          size="lg"
          variant="solid"
          action="primary"
          onPress={handleVerifyOTP}
          className="w-full"
          isDisabled={!isOtpComplete}
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
            onPress={() => console.log("Resend OTP")}
          >
            <ButtonText>Resend</ButtonText>
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
