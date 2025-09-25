import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Image } from "react-native";
import { useState } from "react";
import AppSwitch from "@/components/ui/app-switch";

function LandingPage() {
  const [selectedSegment, setSelectedSegment] = useState("pivot");
  const [isEnabled, setIsEnabled] = useState(false);

  const segmentOptions = [
    {
      id: "pivot",
      backgroundColor: "bg-white",
      textColor: "text-gray-800",
      icon: (
        <Box className="w-6 h-6 bg-orange-500 rounded-full items-center justify-center">
          <Text className="text-white font-bold text-sm">P</Text>
        </Box>
      ),
    },
    {
      id: "chain",
      backgroundColor: "bg-green-500",
      textColor: "text-white",
      icon: <Text className="text-white text-lg">🔗</Text>,
    },
  ];

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <Box className="flex-1 bg-blue-900 relative">
      {/* Background pattern placeholder */}
      <Box className="absolute inset-0">
        <Image
          source={require("@/assets/images/background/app-bg-blue.pivot.png")}
          className="w-full h-full"
          resizeMode="cover"
        />
      </Box>

      {/* Main content */}
      <VStack className="flex-1 justify-center items-center px-6">
        {/* Segmented Control */}
        <AppSwitch />

        {/* Main white card */}
        <Box className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-lg">
          <VStack className="items-center space-y-6">
            {/* Orange P logo */}
            <Box className="w-16 h-16 bg-orange-500 rounded-full items-center justify-center">
              <Text className="text-white font-bold text-2xl">P</Text>
            </Box>

            {/* Title */}
            <Text className="text-gray-800 font-bold text-2xl italic text-center">
              The Pivot Platform
            </Text>

            {/* Description */}
            <Text className="text-gray-600 text-base text-center leading-6">
              Pivot Culinary has the solutions for all your catering and team
              meal needs. We have thoroughly analyzed professional sports
              catering and came up with solutions to fueling your organization.
              Let's discuss what service meets your needs.
            </Text>

            {/* Sign In button */}
            <Button
              className="w-full bg-orange-500 rounded-xl py-4"
              onPress={() => {
                // TODO: Navigate to sign in
                console.log("Sign In pressed");
              }}
            >
              <ButtonText className="text-white font-semibold text-lg">
                Sign In
              </ButtonText>
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}

export default LandingPage;
