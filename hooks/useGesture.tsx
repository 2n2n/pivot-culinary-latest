import {
  Dimensions,
  ViewProps,
} from "react-native";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withClamp, withSpring, withTiming } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useCallback, useState } from "react";

type UseGestureOptions = {
  threshold?: number;
  maxVelocity?: number;
  gestureDragAllowance?: number;
};

const DEFAULT_THRESHOLD = 0.6;
const DEFAULT_MAX_VELOCITY = 1500;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const DEFAULT_GESTURE_DRAG_ALLOWANCE = 50;
const SLOPE_ANGLE_THRESHOLD = 30;

export default function useGesture(options: UseGestureOptions = {}) {
  const MAX_VELOCITY = options.maxVelocity || DEFAULT_MAX_VELOCITY;
  const THRESHOLD = options.threshold || DEFAULT_THRESHOLD;
  const DISTANCE_TO_RELEASE = SCREEN_HEIGHT - SCREEN_HEIGHT * THRESHOLD;
  const GESTURE_DRAG_ALLOWANCE = options.gestureDragAllowance || DEFAULT_GESTURE_DRAG_ALLOWANCE;
  const [release, setRelease] = useState(false);
  const swipeTranslationY = useSharedValue(0);
  const swipeableComponentStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: swipeTranslationY.value,
      }
    ],
  }));
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const hasDraggedUp = Math.abs(event.translationY) > GESTURE_DRAG_ALLOWANCE;
      const angleRadians = Math.atan2(Math.abs(event.translationY), Math.abs(event.translationX));
      const angleDegrees = (angleRadians * 180) / Math.PI;
      const hasValidSlopeAngle = angleDegrees > SLOPE_ANGLE_THRESHOLD;
      if (hasDraggedUp && hasValidSlopeAngle) swipeTranslationY.value = withClamp(
        { min: -SCREEN_HEIGHT, max: 0 },
        withSpring(event.translationY)
      );
    })
    .onEnd((event) => {
      const hasReachedCertainHeight = DISTANCE_TO_RELEASE + event.translationY <= 0;
      const upwardsVelocity = event.velocityY * -1;
      const hasReachedCertainVelocity = upwardsVelocity > MAX_VELOCITY;
      const hasReachedCertainHeightAndVelocity =
        hasReachedCertainHeight || hasReachedCertainVelocity;
      if (hasReachedCertainHeightAndVelocity) {
        swipeTranslationY.value = withTiming(-SCREEN_HEIGHT);
        runOnJS(setRelease)(true);
      } else {
        swipeTranslationY.value = withTiming(0);
        runOnJS(setRelease)(false);
      }
  });
  const SwipeableComponent = useCallback((props: ViewProps & { enabled?: boolean }) => {
    return (
      <GestureDetector gesture={panGesture}>
        <Animated.View
          {...props}
          style={[props.style || {}, swipeableComponentStyle]}
        />
      </GestureDetector>
    );
  }, [panGesture]);

  return {
    release,
    SwipeableComponent,
  };
}
