"use client";
import React, { useEffect, useState } from "react";
import Animated, {
  Extrapolation,
  interpolate,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Icon } from "../icon";
import PivotCulinaryIcon from "@/components/SvgIcons/PivotIconWhite";
import PivotIcon from "@/components/SvgIcons/PivotIcon";
import { Image } from "../image";
import { useColorMode } from "@/app/_layout";
import { ModeType } from "../gluestack-ui-provider";

const AnimatedBox = Animated.createAnimatedComponent(Box);

const AppSwitch = ({
  onChangeMode,
  initialMode = "pivot",
}: {
  onChangeMode: (mode: string) => void;
  initialMode?: string;
}) => {
  const SBAnim = useSharedValue(initialMode === "pivot" ? 0 : 1);
  const [boxWidth, setBoxWidth] = useState(0);
  const [switchContainerWidth, setSwitchContainerWidth] = useState(0);

  const [mode, setMode] = useState(initialMode); // pivot or gameday

  const { setColorMode } = useColorMode();

  useEffect(() => {
    onChangeMode(mode);
    setColorMode(mode === "pivot" ? "light" : ("dark" as ModeType));
  }, [mode]);
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
  }));

  return (
    <Button
      variant="link"
      onPress={() => {
        const newAnimationValue = SBAnim.value === 0 ? 1 : 0;
        setMode(() => {
          SBAnim.value = withTiming(SBAnim.value === 0 ? 1 : 0, {
            duration: 350,
            easing: Easing.out(Easing.quad),
            reduceMotion: ReduceMotion.System,
          });
          return newAnimationValue === 0 ? "pivot" : "gameday";
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
        <Box className="flex-1 justify-center items-center h-10 bg-orange-400">
          <Icon as={PivotCulinaryIcon} className="text-white" />
        </Box>
        {/** // REVIEW: update the color to right color of green. */}
        <Box className="flex-1 justify-center items-center h-10 bg-green-800">
          <Image
            source={require("@/assets/images/icons/gamedayicon-white.png")}
            className="w-7 h-4"
            alt="gameday-icon"
          />
        </Box>

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
          {mode === "pivot" ? (
            <Icon as={PivotIcon} />
          ) : (
            <Box className="relative w-full h-full items-center justify-center w-9 h-5">
              <Image
                source={require("@/assets/images/icons/gameday-icon.png")}
                className="w-full h-full"
                alt="gameday-icon"
              />
            </Box>
          )}
        </AnimatedBox>
      </Box>
    </Button>
  );
};

export default AppSwitch;
