"use client";
import React, { useEffect, useRef, useState } from "react";
import { Easing, Pressable, Text, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { tva } from "@gluestack-ui/utils/nativewind-utils";
import type { VariantProps } from "tailwind-variants";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";

const AnimatedBox = Animated.createAnimatedComponent(Box);

const AppSwitch = () => {
  const SBAnim = useSharedValue(0);
  const [boxWidth, setBoxWidth] = useState(0);
  const [switchContainerWidth, setSwitchContainerWidth] = useState(0);

  const [mode, setMode] = useState("pivot"); // pivot or gameday

  // SB means Switch Button this is SBAnimatedStyles
  const SBanimatedStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          SBAnim.value,
          [0, 1],
          [0, switchContainerWidth - boxWidth],
          Extrapolation.CLAMP
        ),
      },
    ],
  })); // 09914509097
  // TODO: update the color based on the color mode from pivot and gameday
  // const SBCointainerAnimatedStyles = useAnimatedStyle(() => ({
  //   backgroundColor: interpolateColor(
  //     SBAnim.value,
  //     [0, 1],
  //     ["#f97316", "#22c55e"],
  //     "RGB"
  //   ),
  // }));

  return (
    <Button
      variant="link"
      onPress={() => {
        setMode(SBAnim.value === 0 ? "pivot" : "gameday");
        SBAnim.value = withSpring(SBAnim.value === 0 ? 1 : 0, {
          duration: 350,
        });
      }}
    >
      <Box
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setSwitchContainerWidth(width);
        }}
        className="relative flex-row bg-white w-32 h-10 items-start mb-14 rounded-full overflow-hidden"
      >
        <Box className="flex-1 h-10 bg-orange-400" />
        <Box className="flex-1 h-10 bg-green-500" />

        <AnimatedBox
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setBoxWidth(width);
          }}
          className="z-50 w-20 h-10 bg-white rounded-full items-center justify-center"
          style={[
            {
              position: "absolute",
            },
            SBanimatedStyles,
          ]}
        >
          <Text>{mode}</Text>
        </AnimatedBox>
      </Box>
    </Button>
  );
};

export default AppSwitch;
