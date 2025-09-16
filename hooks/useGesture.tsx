import {
  PanResponder,
  Dimensions,
  Animated,
  View,
  ViewProps,
} from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";

type UseGestureOptions = {
  threshold?: number;
  maxVelocity?: number;
};

const DEFAULT_THRESHOLD = 0.8;
const DEFAULT_MAX_VELOCITY = 180;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const ALLOW_PAN_RESPONDER_EVENTS = {};

const AnimateableComponent = Animated.createAnimatedComponent(View);

export default function useGesture(options: UseGestureOptions = {}) {
  const MAX_VELOCITY = options.maxVelocity || DEFAULT_MAX_VELOCITY;
  const THRESHOLD = options.threshold || DEFAULT_THRESHOLD;
  const DISTANCE_TO_RELEASE = SCREEN_HEIGHT - SCREEN_HEIGHT * THRESHOLD;
  const [release, setRelease] = useState(false);
  const swipeTranslationY = useRef(new Animated.Value(0));
  const backgroundColoContainer = useRef(new Animated.Value(0));
  const backgroundColor = backgroundColoContainer.current.interpolate({
    inputRange: [0, 1],
    outputRange: ["red", "green"],
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => true,
      onPanResponderMove: (_, gestureState) => {
        backgroundColoContainer.current.setValue(
          DISTANCE_TO_RELEASE + gestureState.dy >= 0 ? 0 : 1
        );
        swipeTranslationY.current.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        const hasReachedCertainHeight =
          DISTANCE_TO_RELEASE + gestureState.dy <= 0;
        // const hasReachedCertainVelocity = gestureState.vy > MAX_VELOCITY;
        const hasReachedCertainHeightAndVelocity = hasReachedCertainHeight;
        console.log("Has reached certain height", hasReachedCertainHeight);
        if (hasReachedCertainHeight) {
          Animated.spring(swipeTranslationY.current, {
            toValue: SCREEN_HEIGHT * -1,
            useNativeDriver: true,
          }).start(() => setRelease(true));
        } else {
          Animated.spring(swipeTranslationY.current, {
            toValue: 0,
            useNativeDriver: true,
          }).start(() => setRelease(false));
        }
      },
    })
  );
  const SwipeableComponent = useCallback((props: ViewProps) => {
    return (
      <AnimateableComponent
        {...props}
        {...panResponder.current.panHandlers}
        style={{
          transform: [{ translateY: swipeTranslationY.current }],
          backgroundColor,
        }}
      />
    );
  }, []);

  // useEffect(() => {
  //   console.log("🚀 ~ useGesture ~ gestureState.moveY > DISTANCE_TO_RELEASE:", gestureState.moveY > DISTANCE_TO_RELEASE)

  // }, [])

  useEffect(() => {
    if (release) swipeTranslationY.current.setValue(SCREEN_HEIGHT);
  }, [release]);

  return {
    release,
    SwipeableComponent,
  };
}
