import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Image } from "react-native";
import { useState } from "react";
import AppSwitch from "@/components/ui/app-switch";
import { useRouter } from "expo-router";
import { useColorMode } from "./_layout";
import { ModeType } from "@/components/ui/gluestack-ui-provider";
import AppAdaptiveLogo from "@/components/shared/AppAdaptiveLogo";

const ThemeSwitchMap: Record<string, ModeType> = {
  pivot: "light",
  gameday: "dark",
};

function LandingPage() {
  const [selectedSegment, setSelectedSegment] = useState("pivot");
  const { setColorMode } = useColorMode();

  const router = useRouter();

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
            <AppAdaptiveLogo size="md" />

            {/* Title */}
            <Text className="text-gray-800 font-bold text-2xl italic text-center">
              The Pivot Platform
            </Text>

            {/* Description */}
            <Text className="text-gray-600 text-base text-center leading-6">
              {selectedSegment === "pivot"
                ? "Pivot Culinary is a dedicated nutrition partner that provides team catering and meal services tailored for athlete nutrition.\n Through our years of experience, we have learned that no one size fits all when it comes to team nutrition, which is why we work hand in hand with each team’s nutrition staff to customize and build menus that will nourish players to evolve and perform to their best ability. Let’s connect and discuss your team’s nutrition needs!"
                : "Game Day Culinary Solutions is a 24/7 team travel culinary service with a wide network of trusted vendor partners across the nation.\n Whether you’re in the big city or in a small town, Game Day’s got you covered for team meal services at any hour! Inquire with us to see how we can help fuel your team no matter where the game takes you!."}
            </Text>

            {/* Sign In button */}
            <Button
              className="w-full rounded-full"
              onPress={() => {
                router.replace("/(auth)/auth");
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
