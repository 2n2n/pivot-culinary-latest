import type { ModeType } from "@/components/ui/gluestack-ui-provider";

import PivotCulinaryLoadingIndicator from "@/components/LoadingIndicator/PivotCulinaryLoadingIndicator.";
import GamedayLoadingIndicator from "@/components/LoadingIndicator/GamedayLoadingIndicator";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";

import Animated, { FadeIn, FadeInDown, FadeOut, FadeOutUp, interpolateColor, useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { cssInterop } from "nativewind";
import { Image } from "expo-image";
import { Avatar, AvatarFallbackText, AvatarImage } from "../ui/avatar";

const GAMEDAY_PRIMARY = require("@/assets/images/primaries/gameday-primary.png");
const PIVOT_PRIMARY = require("@/assets/images/primaries/pivot-primary.png");
const THEME_LOADER_SCREEN_FADE_DURATION = 250;
const THEME_LOADER_SCREEN_FADE_DELAY = 1000;
const THEME_TRANSITION_DURATION = 1000;
const LOADING_INDICATOR_SIZE = 64;
const GAMEDAY_BLUE = "#022D55";
const PIVOT_BLUE = "#212945";

cssInterop(Image, { className: 'style' });

export default function ThemedLoaderScreen(props: ThemedLoaderScreenProps) {
    const appearance = useSharedValue(0);
    const [showTransition, setShowTransition] = useState(false);
    const themeTransition = useSharedValue(0);
    const containerViewAnimatedStyle = useAnimatedStyle(() => ({
        opacity: appearance.value,
        backgroundColor: interpolateColor(
            themeTransition.value, 
            [0, 1], 
            props.theme === "light" ? [GAMEDAY_BLUE, PIVOT_BLUE] : [PIVOT_BLUE, GAMEDAY_BLUE]
        ),
    }), [props.theme]);
    useEffect(() => {
        cancelAnimationFrame(appearance.value);
        if (props.switching) {
            appearance.value = withDelay(THEME_LOADER_SCREEN_FADE_DELAY, withTiming(1, { duration: THEME_LOADER_SCREEN_FADE_DURATION }))
        } else if (props.completed) {
            cancelAnimationFrame(themeTransition.value);
            setShowTransition(true);
            themeTransition.value = withTiming(1, { duration: THEME_TRANSITION_DURATION });
            appearance.value = withDelay(THEME_TRANSITION_DURATION, withTiming(0, { duration: THEME_LOADER_SCREEN_FADE_DURATION }));
        };
        return () => {
            themeTransition.value = 0;
            setShowTransition(false);
        };
    }, [props.switching, props.completed]);
    return <>
        {props.children}
        <Animated.View style={[containerViewAnimatedStyle, themeLoaderScreenStyle.container]}>
            {!showTransition && <Animated.View exiting={FadeOutUp} style={themeLoaderScreenStyle.content}>
                {props.theme === "dark" ? <PivotCulinaryLoadingIndicator entering={FadeIn} exiting={FadeOut} size={LOADING_INDICATOR_SIZE} /> : <GamedayLoadingIndicator entering={FadeIn} exiting={FadeOut} size={LOADING_INDICATOR_SIZE} />}
                {props.account && <VStack className="gap-4 items-center">
                    <Text className="text-white">Switching to...</Text>
                    <HStack className="gap-3 py-3 px-4 bg-white rounded-xl items-center">
                        <Avatar size="lg">
                            <AvatarImage source={{ uri: props.account.avatar }} />
                            <AvatarFallbackText>{props.account.alias}</AvatarFallbackText>
                        </Avatar>
                        <VStack className="gap-1">
                            <Text className="text-black font-bold">{props.account.name}</Text>
                            <Text className="text-black text-sm">{props.account.theme}</Text>
                        </VStack>
                    </HStack>
                </VStack>}
            </Animated.View>}
            {showTransition && <Animated.View entering={FadeInDown} style={themeLoaderScreenStyle.content}>
                <Image
                    source={props.theme === "light" ? PIVOT_PRIMARY : GAMEDAY_PRIMARY}
                    contentFit="contain"
                    alt="Application Primary"
                    className="w-[80%] h-[200px]"
                />
            </Animated.View>}
        </Animated.View>
    </>
};

type ThemedLoaderScreenProps = React.PropsWithChildren<{
    theme: ModeType;
    account?: {
        name: string;
        avatar: string;
        theme: string;
        alias: string;
    },
    switching: boolean;
    completed: boolean;
}>;

//! NOTE: nativewind cssInterop does not appear to work with Animated.View
const themeLoaderScreenStyle = StyleSheet.create({
    container: {
        display: "flex",
        position: "absolute",
        inset: 0,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 48,
        objectFit: "contain"
    },
})