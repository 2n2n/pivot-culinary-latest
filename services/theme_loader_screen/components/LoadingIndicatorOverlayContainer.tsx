import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { StyleSheet } from "react-native";
import { ModeType } from "@/components/ui/gluestack-ui-provider";
import { PropsWithChildren, useEffect } from "react";

const GAMEDAY_BLUE_BGCOLOR = "#022D55";
const PIVOT_BLUE_BGCOLOR = "#212945";

/**
 * NOTES:
 * @Pivot - 0
 * @Gameday - 1
 *  */

const PIVOT = 0;
const GAMEDAY = 1;

const FADE_IN = 1;
const FADE_OUT = 0;

const LoadingIndicatorOverlayContainer: React.FC<
  PropsWithChildren<{
    theme: ModeType;
    isSwitching: boolean;
    isCompleted: boolean;
  }>
> = ({ theme, isSwitching, isCompleted, children }) => {
  // appearance will handle the fade in and out of the container
  const appearance = useSharedValue(isSwitching ? FADE_IN : FADE_OUT);

  // themeTransition will handle the switching animation
  const themeTransition = useSharedValue(theme === "light" ? PIVOT : GAMEDAY);

  const containerViewAnimatedStyle = useAnimatedStyle(
    () => ({
      opacity: appearance.value,
      backgroundColor: interpolateColor(
        themeTransition.value,
        [PIVOT, GAMEDAY],
        [PIVOT_BLUE_BGCOLOR, GAMEDAY_BLUE_BGCOLOR]
      ),
    }),
    [theme]
  );

  useEffect(() => {
    if (isSwitching) appearance.value = withTiming(FADE_IN);
    else appearance.value = withDelay(2000, withTiming(FADE_OUT));
  }, [isSwitching]);

  useEffect(() => {
    if (isSwitching && isCompleted) {
      const to = theme === "light" ? PIVOT : GAMEDAY;
      themeTransition.value = withTiming(to);
    }
  }, [theme, isSwitching, isCompleted]);

  return (
    <Animated.View
      style={[themeLoaderScreenStyle.container, containerViewAnimatedStyle]}
    >
      {children}
    </Animated.View>
  );
};

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

export default LoadingIndicatorOverlayContainer;
