import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";

import Animated, { Extrapolation, interpolate, useAnimatedProps, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { useEffect } from "react";

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function ReviewSubmittedIndicator() {
    const transition = useSharedValue(0);
    const circlePathAnimatedProps = useAnimatedProps<React.ComponentProps<typeof AnimatedPath>>(() => ({
        strokeDasharray: 252,
        strokeDashoffset: interpolate(transition.value, [0, 1], [252, 0], Extrapolation.CLAMP)
    }));
    const checkPathAnimatedProps = useAnimatedProps<React.ComponentProps<typeof AnimatedPath>>(() => ({
        strokeDasharray: 34,
        strokeDashoffset: interpolate(transition.value, [0, 1], [34, 0], Extrapolation.CLAMP)
    }));
    useEffect(() => {
        transition.value = withTiming(1, { duration: 1000 });
        return () => {
            transition.value = 0;
        }
    }, []);
    return <VStack className="gap-4 items-center">
        <Svg width="82" height="82" viewBox="0 0 82 82" fill="none" >
            <AnimatedPath 
                d="M41 81C63.092 81 81 63.092 81 41C81 18.908 63.092 1 41 1C18.908 1 1 18.908 1 41C1 63.092 18.908 81 41 81Z" 
                stroke="white" 
                stroke-width="4" 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                animatedProps={circlePathAnimatedProps}
            />
            <AnimatedPath 
                d="M29 41L37 49L53 33" 
                stroke="white" 
                stroke-width="4" 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                animatedProps={checkPathAnimatedProps}
            />
        </Svg>
        <Text className="text-lg font-bold text-white">Thank you for the Feedback</Text>
    </VStack>
}