import {
  PanResponder,
  Dimensions,
  Animated,
  View,
  ViewProps,
} from "react-native";
import { RefObject, useCallback, useRef, useState } from "react";

type UseGestureOptions = {
  threshold?: number;
  maxVelocity?: number;
  gestureDragAllowance?: number;
};

const DEFAULT_THRESHOLD = 0.6;
const DEFAULT_MAX_VELOCITY = 180;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const DEFAULT_GESTURE_DRAG_ALLOWANCE = 50;

const AnimateableComponent = Animated.createAnimatedComponent(View);

export default function useGesture(options: UseGestureOptions = {}) {
  const MAX_VELOCITY = options.maxVelocity || DEFAULT_MAX_VELOCITY;
  const THRESHOLD = options.threshold || DEFAULT_THRESHOLD;
  const DISTANCE_TO_RELEASE = SCREEN_HEIGHT - SCREEN_HEIGHT * THRESHOLD;
  const GESTURE_DRAG_ALLOWANCE = options.gestureDragAllowance || DEFAULT_GESTURE_DRAG_ALLOWANCE;
  const [release, setRelease] = useState(false);
  const swipeTranslationY = useRef(new Animated.Value(0));
  const safeSwipeTranslationY = swipeTranslationY.current.interpolate({
    inputRange: [SCREEN_HEIGHT * -1, 0],
    outputRange: [SCREEN_HEIGHT * -1, 0],
    extrapolate: "clamp"
  })
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy < -GESTURE_DRAG_ALLOWANCE && Math.abs(gestureState.dx) < GESTURE_DRAG_ALLOWANCE,
      onPanResponderTerminationRequest: () => true, 
      onPanResponderMove: Animated.event(
        [null, { dy: swipeTranslationY.current }]
      ),
      onPanResponderRelease: (_, gestureState) => {
        const hasReachedCertainHeight = DISTANCE_TO_RELEASE + gestureState.dy <= 0;
        const calculatedVelocity = Math.abs(gestureState.vy) * 100;
        const hasReachedCertainVelocity = calculatedVelocity > MAX_VELOCITY;
        const hasReachedCertainHeightAndVelocity = hasReachedCertainHeight || hasReachedCertainVelocity;
        if (hasReachedCertainHeightAndVelocity) {
          Animated.spring(swipeTranslationY.current, {
            toValue: SCREEN_HEIGHT * -1,
            useNativeDriver: true,
          }).start(() => setRelease(true));
        } else {
          Animated.spring(swipeTranslationY.current, {
            toValue: 0,
            bounciness: 0,
            useNativeDriver: true,
          }).start(() => setRelease(false));
        }
      },
    })
  );
  const SwipeableComponent = useCallback((props: ViewProps & { enabled?: boolean }) => {
    return (
      <AnimateableComponent
        {...props}
        {...(props.enabled === undefined || props.enabled ? panResponder.current.panHandlers : {})}
        style={{
          borderWidth: 1,
          transform: [{ translateY: safeSwipeTranslationY }],
        }}
      />
    );
  }, []);

  return {
    release,
    SwipeableComponent,
  };
}
