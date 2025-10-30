import type { ModeType } from "@/components/ui/gluestack-ui-provider";
import LoadingIndicatorOverlayContainer from "./LoadingIndicatorOverlayContainer";
import PivotCulinaryLoadingIndicator from "./PivotCulinaryLoadingIndicator";
import GamedayLoadingIndicator from "./GamedayLoadingIndicator";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";

import Animated, { FadeIn, FadeOut, FadeOutUp } from "react-native-reanimated";
import { StyleSheet } from "react-native";
import { cssInterop } from "nativewind";
import { Image } from "expo-image";
import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import AppLogo from "@/components/AppLogo";
import { getAccountLocation, getOtherTheme } from "@/helpers";

const LOADING_INDICATOR_SIZE = 64;

cssInterop(Image, { className: "style" });

export default function ThemedLoaderScreen(props: ThemedLoaderScreenProps) {
  return (
    <>
      {props.children}
      <LoadingIndicatorOverlayContainer
        isSwitching={props.switching}
        isCompleted={props.completed}
        theme={props.theme}
      >
        {props.completed && (
          <Animated.View
            exiting={FadeOutUp}
            style={themeLoaderScreenStyle.content}
          >
            {props.theme === "light" ? (
              <PivotCulinaryLoadingIndicator
                entering={FadeIn}
                exiting={FadeOut}
                size={LOADING_INDICATOR_SIZE}
              />
            ) : (
              <GamedayLoadingIndicator
                entering={FadeIn}
                exiting={FadeOut}
                size={LOADING_INDICATOR_SIZE}
              />
            )}
            {props.account && (
              <VStack className="gap-4 items-center">
                <Text className="text-white">Switching to...</Text>
                <HStack className="gap-3 py-3 px-4 bg-white rounded-xl items-center">
                  <Avatar size="lg">
                    {/* <AvatarImage source={{ uri: props.account.avatar }} /> */}
                    <AvatarFallbackText>
                      {(props.account.name || "").replace("-", "")}
                    </AvatarFallbackText>
                  </Avatar>
                  <VStack className="gap-1">
                    <Text className="text-black font-bold">
                      {props.account.name}
                    </Text>
                    <Text className="text-black text-sm">
                      {getAccountLocation(props.account) === "PIVOT"
                        ? "Pivot Culinary"
                        : "Game Day"}
                    </Text>
                  </VStack>
                </HStack>
              </VStack>
            )}
          </Animated.View>
        )}

        {!props.completed && (
          <Animated.View
            exiting={FadeOutUp}
            style={themeLoaderScreenStyle.content}
          >
            <AppLogo
              theme={getOtherTheme(props.theme)}
              className="w-[80%] h-[200px]"
            />
          </Animated.View>
        )}
      </LoadingIndicatorOverlayContainer>
    </>
  );
}

type ThemedLoaderScreenProps = React.PropsWithChildren<{
  theme: ModeType;
  account?: Account;
  switching: boolean;
  completed: boolean;
}>;

//! NOTE: nativewind cssInterop does not appear to work with Animated.View
const themeLoaderScreenStyle = StyleSheet.create({
  container: {
    display: "flex",
    position: "absolute",
    inset: 0,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 48,
    objectFit: "contain",
  },
});
