import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { AgendaComponentContext } from "@/components/Agenda/context";

import Animated, { Easing, FadeIn, FadeOut, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { RefreshCwIcon } from "lucide-react-native";
import { useContext, useEffect } from "react";
import { StyleSheet } from "react-native";

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
    return <Animated.View key="refresh-button" entering={FadeIn} exiting={FadeOut} style={[
            AgendaContentRefreshButtonStyles.container, 
            { top: styles.overheadButtonInset }
        ]}>
        <Button onPress={onPress} disabled={refreshing} size={styles.overheadButtonSize} className="rounded-full"> 
            <AnimatedButtonIcon as={RefreshCwIcon} size="md" stroke="white" style={animatedButtonIconRotationProps}/>
            {(!refreshing && hasOutdatedItems) && <ButtonText>Reload agendas</ButtonText>}
        </Button>
    </Animated.View>
};

const AgendaContentRefreshButtonStyles = StyleSheet.create({
    container: {
        position: "absolute",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    }
});

type RefreshButtonProps = {
    hasOutdatedItems: boolean,
    refreshing: boolean,
    onPress: () => void;
}