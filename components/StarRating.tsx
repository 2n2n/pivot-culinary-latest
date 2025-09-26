import type { SharedValue } from "react-native-reanimated";

import { HStack } from "@/components/ui/hstack";
import { Box } from "@/components/ui/box";

import Animated, { Extrapolation, interpolate, runOnJS, useAnimatedProps, useDerivedValue, useSharedValue, withSpring } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Svg, { Defs, Mask, Path } from "react-native-svg";
import React, { useEffect } from "react";
import * as Haptics from "expo-haptics";

type StarRatingProps = {
    rating?: number;
    disabled?: boolean;
    maxRating?: number;
    size?: number;
    spacing?: number;
    onChange?: (value: number) => void;
};

const AnimatedPath = Animated.createAnimatedComponent(Path);

const DEFAULT_VALUE = 0;
const DEFAULT_MAX_RATING = 5;
const DEFAULT_DISABLED = false;
const DEFAULT_SIZE = 40;
const DEFAULT_SPACING = 8;

const StarRating = (props: StarRatingProps) => {
    const rating = props.rating || DEFAULT_VALUE;
    const maxRating = props.maxRating || DEFAULT_MAX_RATING;
    const disabled = props.disabled || DEFAULT_DISABLED;
    const size = props.size || DEFAULT_SIZE;
    const spacing = props.spacing || DEFAULT_SPACING;
    const currentRating = useSharedValue(rating);
    const isDragging = useSharedValue(false);
    const tapGesture = Gesture.Tap().onStart((event) => {
        const pointedUnit = event.x % (size + spacing);
        const inBetween = pointedUnit > size;
        if (inBetween) return;
        const nthTappedStar = Math.floor(event.x / (size + spacing));
        let calculatedTappedHalfStar;
        if (nthTappedStar === 0) calculatedTappedHalfStar = pointedUnit >= size * 0.66 ? 1 : pointedUnit > size * 0.33 ? 0.5 : 0;
        else calculatedTappedHalfStar = pointedUnit >= size / 2 ? 1 : 0.5;
        const calculatedRating = nthTappedStar + calculatedTappedHalfStar;
        const sanitizedCalculatedRating = Math.max(Math.min(maxRating, Math.min(maxRating, calculatedRating)), DEFAULT_VALUE);
        currentRating.value = sanitizedCalculatedRating;
        if (props.onChange) runOnJS(props.onChange)(sanitizedCalculatedRating);
    });
    const panGesture = Gesture.Pan().onTouchesDown(() => {
        isDragging.value = true;
    }).onUpdate((event) => {
        const pointedUnit = event.x % (size + spacing);
        const inBetween = pointedUnit > size;
        if (inBetween) return;
        const nthTappedStar = Math.floor(event.x / (size + spacing));
        let calculatedTappedHalfStar;
        if (nthTappedStar === 0) calculatedTappedHalfStar = pointedUnit >= size * 0.66 ? 1 : pointedUnit > size * 0.33 ? 0.5 : 0;
        else calculatedTappedHalfStar = pointedUnit >= size / 2 ? 1 : 0.5;
        const calculatedRating = nthTappedStar + calculatedTappedHalfStar;
        const sanitizedCalculatedRating = Math.max(Math.min(maxRating, Math.min(maxRating, calculatedRating)), DEFAULT_VALUE);
        if (currentRating.value != sanitizedCalculatedRating) runOnJS(Haptics.selectionAsync)();
        currentRating.value = sanitizedCalculatedRating;
        if (props.onChange) runOnJS(props.onChange)(sanitizedCalculatedRating);
    }).onTouchesUp(() => {
        isDragging.value = false;
    });
    const tapAndPanGesture = Gesture.Simultaneous(tapGesture, panGesture);
    useEffect(() => {
        tapGesture.enabled(!disabled);
        panGesture.enabled(!disabled);
    }, [disabled]);
    return <GestureDetector gesture={tapAndPanGesture}>
        <HStack style={{ gap: spacing, position: "relative" }}>
            {Array.from({ length: maxRating }).map((_, i) => (
                <StarElement key={i} index={i} size={size} rating={currentRating} dragging={isDragging} />
            ))}
        </HStack>
    </GestureDetector>
};

type StarElementProps = {
    rating: SharedValue<number>;
    index: number;
    dragging: SharedValue<boolean>;
    size: number;
};

const MAX_SWELL_DISTANCE = 3;

export const StarElement = (props: StarElementProps) => {
    const fillTransition = useDerivedValue(() => {
        return withSpring(props.rating.value >= props.index + 1 ? 1 : props.rating.value === props.index + 0.5 ? 0.5 : 0);
    });
    const swellTransition = useDerivedValue(() => {
        if (!props.dragging.value) return withSpring(0);
        const distance = Math.abs(props.index - props.rating.value);
        const normalizedDistance = (MAX_SWELL_DISTANCE - distance) / MAX_SWELL_DISTANCE;
        return withSpring(normalizedDistance);
    });
    const animatedStrokeProps = useAnimatedProps<React.ComponentProps<typeof AnimatedPath>>(() => ({
        strokeWidth: interpolate(swellTransition.value, [0, 1], [1, 1.6], Extrapolation.CLAMP),
    }));
    const animatedMaskedPathProps = useAnimatedProps<React.ComponentProps<typeof AnimatedPath>>(() => ({
        d: `M0 0 0 0 l${interpolate(fillTransition.value, [0, 1], [0, 24], Extrapolation.CLAMP)} 0 0 0 l0 23 0 0 l0 0 -${interpolate(fillTransition.value, [0, 1], [0, 24], Extrapolation.CLAMP)} 0 z`
    }));
    return <Box style={{ width: props.size, height: props.size, overflow: "visible" }}>
        <Svg width={props.size} height={props.size} viewBox="0 0 25 24">
            <Defs>
                <Mask
                    id="starmask"
                    x="0"
                    y="0"
                    width="25"
                    height="24"
                    maskUnits="userSpaceOnUse"
                    maskContentUnits="userSpaceOnUse"
                >
                    <Path
                        fill="white"
                        d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
                    />
                </Mask>
            </Defs>
            <AnimatedPath
                fill="none"
                stroke="orange"
                strokeWidth="1"
                d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
                animatedProps={animatedStrokeProps}
            />
            <AnimatedPath
                fill="orange"
                mask="url(#starmask)"
                d="M0 0 0 0 l24 0 0 0 l0 23 0 0 l0 0 -24 0 z"
                animatedProps={animatedMaskedPathProps}
            />
        </Svg>
    </Box>
};

export default StarRating;