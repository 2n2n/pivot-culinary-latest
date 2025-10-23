import { Button, ButtonText } from "@/components/ui/button";

import Animated, { Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useEffect } from "react";

export default function AgendaContentReturnToPresentButton({ hasOutdatedItems, isPresentDateVisible, onPress }: ReturnToPresentButtonProps) {
    const transition = useSharedValue(0);
    const returnToPresentButtonStyle = useAnimatedStyle(() => ({
        position: "absolute", 
        top: "0%",
        left: "50%",
        opacity: interpolate(transition.value, [0, 1], [0, 1], Extrapolation.CLAMP),
        transform: [
            { translateX: "-50%" },
            { translateY: interpolate(transition.value, [-1, 0, 1], [15, 0, -50]) }
        ]
    }), [transition.value]);
    useEffect(() => {
        transition.value = withTiming(!hasOutdatedItems && !isPresentDateVisible ? 1 : 0);
    }, [hasOutdatedItems, isPresentDateVisible])
    return <Animated.View style={returnToPresentButtonStyle}>
        <Button onPress={onPress} size="sm" className="rounded-full"> 
            <ButtonText>Return to present</ButtonText>
        </Button>
    </Animated.View>
}

type ReturnToPresentButtonProps = {
    hasOutdatedItems: boolean,
    isPresentDateVisible: boolean,
    onPress: () => void;
}