import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";

import Animated, { Extrapolation, interpolate, runOnJS, useAnimatedStyle, useSharedValue, withClamp, withSpring, withTiming } from "react-native-reanimated";
import { Dimensions, KeyboardAvoidingView, ScrollView, ViewProps } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useId, useMemo, useRef } from "react";
import { ChevronUp } from "lucide-react-native";

type SwipeUpViewProps = {
  enabled?: boolean
  threshold?: number;
  maxVelocity?: number;
  gestureDragAllowance?: number;
  onRelease?: () => void;
};

const DEFAULT_THRESHOLD = 0.6;
const DEFAULT_MAX_VELOCITY = 1500;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const DEFAULT_GESTURE_DRAG_ALLOWANCE = 50;
const SLOPE_ANGLE_THRESHOLD = 30;

export default function SwipeUpView(props: ViewProps & SwipeUpViewProps) {
  const MAX_VELOCITY = props.maxVelocity || DEFAULT_MAX_VELOCITY;
  const THRESHOLD = props.threshold || DEFAULT_THRESHOLD;
  const DISTANCE_TO_RELEASE = SCREEN_HEIGHT - SCREEN_HEIGHT * THRESHOLD;
  const GESTURE_DRAG_ALLOWANCE = props.gestureDragAllowance || DEFAULT_GESTURE_DRAG_ALLOWANCE;
  const swipableViewKey = useId();
  const swipeUpIndicatorKey = useId();
  const {children, ...viewProps} = props;
  const enabled = props.enabled || false;
  const { bottom } = useSafeAreaInsets();
  const swipeUpIndicatorLift = useSharedValue(0);
  const swipeTranslationY = useSharedValue(0);
  const panGesture = useMemo(() => {
    return Gesture.Pan()
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
          if (props.onRelease) runOnJS(props.onRelease)();
        } else swipeTranslationY.value = withTiming(0);
    });
  }, [DISTANCE_TO_RELEASE, GESTURE_DRAG_ALLOWANCE, MAX_VELOCITY, swipeTranslationY]);
  const swipeableComponentStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: swipeTranslationY.value,
      }
    ],
    overflow: "hidden",
  }));
  const swipeableComponentContainerStyle = useAnimatedStyle(() => ({
    borderBottomStartRadius: interpolate(swipeUpIndicatorLift.value, [0, 1], [0, 32], Extrapolation.CLAMP),
    borderBottomEndRadius: interpolate(swipeUpIndicatorLift.value, [0, 1], [0, 32], Extrapolation.CLAMP),
  }));
  const swipeUpIndicatorStyle = useAnimatedStyle(() => ({
    opacity: interpolate(swipeUpIndicatorLift.value, [0, 1], [0, 2], Extrapolation.CLAMP),
    height: interpolate(swipeUpIndicatorLift.value, [0, 1], [0, 100], Extrapolation.CLAMP),
  }));
  useEffect(() => {
    swipeUpIndicatorLift.value = withSpring(enabled ? 1 : 0);
  }, [enabled]);
  return <Animated.View
      key={swipableViewKey}
      {...viewProps}
      style={[{ flex: 1 }, swipeableComponentStyle]}
    >
      <Animated.View style={[{ flex: 1 }, props.style || {}, swipeableComponentContainerStyle]}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: bottom }}>
          <KeyboardAvoidingView behavior="position" enabled={true} style={{ flex: 1 }} keyboardVerticalOffset={100}>
            {children}
          </KeyboardAvoidingView>
        </ScrollView>
      </Animated.View>
      {enabled && <GestureDetector gesture={panGesture}>
        <Animated.View 
          key={swipeUpIndicatorKey} 
          style={[{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 12 }, swipeUpIndicatorStyle]}
        >
          <Icon as={ChevronUp} className="text-white" />
          <Text className="text-white">Swipe up to Submit Feedback</Text>
          <Icon as={ChevronUp} className="text-white" />
        </Animated.View>
      </GestureDetector>}
      {!enabled && <Animated.View 
          key={swipeUpIndicatorKey} 
          style={[{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 12 }, swipeUpIndicatorStyle]}
        >
          <Icon as={ChevronUp} className="text-white" />
          <Text className="text-white">Swipe up to Submit Feedback</Text>
          <Icon as={ChevronUp} className="text-white" />
        </Animated.View>}
    </Animated.View>
};