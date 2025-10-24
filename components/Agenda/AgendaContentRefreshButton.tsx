import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { AgendaComponentContext } from "@/components/Agenda/context";

import Animated, { Easing, FadeIn, FadeOut, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { RefreshCwIcon } from "lucide-react-native";
import { useContext, useEffect } from "react";
import { cssInterop } from "nativewind";

cssInterop(Animated.View, { className: 'style' });
const AnimatedButtonIcon = Animated.createAnimatedComponent(ButtonIcon);

export default function AgendaContentRefreshButton({ refreshing, hasOutdatedItems, onPress }: RefreshButtonProps) {
    const animatedButtonIconRotation = useSharedValue(0);
    const { styles } = useContext(AgendaComponentContext);
    const animatedButtonIconRotationProps = useAnimatedStyle(() => ({
        transform: [{ rotate: `${animatedButtonIconRotation.value}deg` }],
    }));
    useEffect(() => {
        if (refreshing) animatedButtonIconRotation.value = withRepeat(withTiming(360, { duration: 1000, easing: Easing.linear }), -1);
        else animatedButtonIconRotation.value = withTiming(0, { duration: 1000 });
    }, [refreshing]);
    if (!hasOutdatedItems) return null;
    return <Animated.View key="refresh-button" entering={FadeIn} exiting={FadeOut} style={{
        position: "absolute",
        top: styles.overheadButtonInset,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    }}>
        <Button onPress={onPress} disabled={refreshing} size={styles.overheadButtonSize} className="rounded-full"> 
            <AnimatedButtonIcon as={RefreshCwIcon} size={18} stroke="white" style={animatedButtonIconRotationProps}/>
            {(!refreshing && hasOutdatedItems) && <ButtonText>Reload agendas</ButtonText>}
        </Button>
    </Animated.View>
}

type RefreshButtonProps = {
    refreshing: boolean,
    hasOutdatedItems: boolean,
    onPress: () => void;
}