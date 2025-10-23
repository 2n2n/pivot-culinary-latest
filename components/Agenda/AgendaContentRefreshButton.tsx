import type { SharedValue } from "react-native-reanimated";

import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";

import Animated, { Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { RefreshCwIcon } from "lucide-react-native";
import { useEffect } from "react";

export default function AgendaContentRefreshButton({ refreshing, hasOutdatedItems, onPress }: RefreshButtonProps) {
    const transition = useSharedValue(0);
    const refreshButtonStyle = useAnimatedStyle(() => ({
        position: "absolute", 
        top: 0,
        left: "50%",
        transform: [
            { translateX: "-50%" },
            { translateY: interpolate(transition.value, [0, 1], [-100, 15], Extrapolation.CLAMP) }
        ]
    }), [transition.value]);
    useEffect(() => {
        transition.value = withTiming(hasOutdatedItems ? 1 : 0);
        return () => {
            transition.value = 0
        };
    }, [hasOutdatedItems]);
    return <Animated.View style={refreshButtonStyle}>
        <Button onPress={onPress} disabled={refreshing} className="rounded-full"> 
            <ButtonIcon as={RefreshCwIcon} size={18} stroke="white"/>
            {!refreshing && !!hasOutdatedItems && <ButtonText>Reload agendas</ButtonText>}
        </Button>
    </Animated.View>
}

type RefreshButtonProps = {
    refreshing: boolean,
    hasOutdatedItems: boolean,
    onPress: () => void;
}