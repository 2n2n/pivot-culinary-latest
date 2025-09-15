import {
  PanResponder,
  Dimensions,
  Animated,
  View,
  ViewProps,
} from "react-native";
import { useCallback, useRef, useState } from "react";

type UseGestureOptions = {
  threshold?: number;
  maxVelocity?: number;
};

const DEFAULT_THRESHOLD = 0.6;
const DEFAULT_MAX_VELOCITY = 180;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const ALLOW_PAN_RESPONDER_EVENTS = {};

const AnimateableComponent = Animated.createAnimatedComponent(View);

export default function useGesture(options: UseGestureOptions = {}) {
  const MAX_VELOCITY = options.maxVelocity || DEFAULT_MAX_VELOCITY;
  const THRESHOLD = options.threshold || DEFAULT_THRESHOLD;
  const DISTANCE_TO_RELEASE = SCREEN_HEIGHT * THRESHOLD;
  const [release, setRelease] = useState(true);
  const swipeTranslationY = useRef(new Animated.Value(0));
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => true,
      onPanResponderMove: Animated.event([
        null,
        { dy: swipeTranslationY.current },
      ]),
      onPanResponderRelease: (_, gestureState) => {
        const hasReachedCertainHeight =
          gestureState.moveY > DISTANCE_TO_RELEASE;
        const hasReachedCertainVelocity = gestureState.vy > MAX_VELOCITY;
        const hasReachedCertainHeightAndVelocity =
          hasReachedCertainHeight && hasReachedCertainVelocity;
        if (hasReachedCertainHeightAndVelocity) setRelease(true);
      },
    })
  );
  const SwipeableComponent = useCallback((props: ViewProps) => {
    return (
      <AnimateableComponent
        {...props}
        {...panResponder.current.panHandlers}
        style={{ transform: [{ translateY: swipeTranslationY.current }] }}
      />
    );
  }, []);

  return {
    release,
    SwipeableComponent,
  };
}
