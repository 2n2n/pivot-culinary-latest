import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Image } from "react-native";
import { useState } from "react";
import AppSwitch from "@/components/ui/app-switch";
import { useRouter } from "expo-router";
import { Icon } from "@/components/ui/icon";
import PivotIcon from "@/components/SvgIcons/PivotIcon";
import { useColorMode } from "./_layout";
import { ModeType } from "@/components/ui/gluestack-ui-provider";

const ThemeSwitchMap: Record<string, ModeType> = {
  pivot: "light",
  gameday: "dark",
};

function LandingPage() {
  const [selectedSegment, setSelectedSegment] = useState("pivot");
  const [isEnabled, setIsEnabled] = useState(false);

  const { setColorMode } = useColorMode();

  const router = useRouter();

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <Box className="flex-1 bg-blue-900 relative">
      {/* Background pattern placeholder */}
      <Box className="absolute inset-0">
        {selectedSegment === "pivot" ? (
          <Image
            source={require("@/assets/images/background/app-bg-blue.pivot.png")}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <Image
            source={require("@/assets/images/background/app-bg-blue.gameday.png")}
            className="w-full h-full"
            resizeMode="cover"
          />
        )}
      </Box>

      {/* Main content */}
      <VStack className="flex-1 justify-center items-center px-6">
        {/* Segmented Control */}
        <AppSwitch
          onChangeMode={(mode) =>
            setSelectedSegment(() => {
              setColorMode(ThemeSwitchMap[mode as keyof typeof ThemeSwitchMap]);
              return mode;
            })
          }
          initialMode={selectedSegment}
        />

        {/* Main white card */}
        <Box className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-lg">
          <VStack className="items-center gap-4">
            {/* Orange P logo */}
            <Icon as={PivotIcon} className="h-14 w-14" />

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
              className="w-full rounded-full"
              onPress={() => {
                router.replace("/(auth)");
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
