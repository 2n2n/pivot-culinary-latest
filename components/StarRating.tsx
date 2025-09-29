import type { SharedValue } from "react-native-reanimated";

import { HStack } from "@/components/ui/hstack";
import { Box } from "@/components/ui/box";

import Animated, { Extrapolation, interpolate, runOnJS, runOnUI, useAnimatedProps, useDerivedValue, useSharedValue, withSpring } from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import React, { useCallback, useEffect, useRef } from "react";
import Svg, { Defs, Mask, Path } from "react-native-svg";
import * as Haptics from "expo-haptics";

type StarRatingProps = {
    rating?: number;
    disabled?: boolean;
    maxRating?: number;
    size?: number;
    spacing?: number;
    onChange?: (value: number) => void;
} & React.ComponentProps<typeof HStack>;

const AnimatedPath = Animated.createAnimatedComponent(Path);

const DEFAULT_VALUE = 0;
const DEFAULT_MAX_RATING = 5;
const DEFAULT_DISABLED = false;
const DEFAULT_SIZE = 40;
const DEFAULT_SPACING = 8;
const ONCHANGE_CALL_DEBOUNCE_MS = 150; // Throttle haptic feedback to 50ms

//! NOTE: excessive hot-reloading will crash the dev app
const StarRating = (props: StarRatingProps) => {
    const rating = props.rating || DEFAULT_VALUE;
    const maxRating = props.maxRating || DEFAULT_MAX_RATING;
    const disabled = props.disabled || DEFAULT_DISABLED;
    const size = props.size || DEFAULT_SIZE;
    const spacing = props.spacing || DEFAULT_SPACING;
    const currentRating = useSharedValue(rating);
    const isDragging = useSharedValue(false);
    const debounceRef = useRef<number | null>(null);
    const handleChange = useCallback((value: number) => {   
        if (!props.onChange) return;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            if (!props.onChange) return;
            props.onChange(value);
        }, ONCHANGE_CALL_DEBOUNCE_MS);
    }, [props.onChange]);
    const tapGesture = Gesture.Tap().onStart((event) => {
        const positionX = event.x;
        const pointedArea = positionX % (size + spacing);
        const tappedAreaIsInBetweenStars = pointedArea > size;
        if (tappedAreaIsInBetweenStars) return;
        const nthTappedStar = Math.floor(positionX / (size + spacing));
        let calculatedTappedHalfStar;
        if (nthTappedStar === 0) calculatedTappedHalfStar = pointedArea >= size * 0.66 ? 1 : pointedArea > size * 0.33 ? 0.5 : 0;
        else calculatedTappedHalfStar = pointedArea >= size / 2 ? 1 : 0.5;
        const calculatedRating = nthTappedStar + calculatedTappedHalfStar;
        const sanitizedCalculatedRating = Math.max(Math.min(maxRating, Math.min(maxRating, calculatedRating)), DEFAULT_VALUE);
        if (currentRating.value != sanitizedCalculatedRating) {
            currentRating.value = sanitizedCalculatedRating;
            runOnJS(handleChange)(sanitizedCalculatedRating);
        }
    });
    const panGesture = Gesture.Pan().onTouchesDown(() => {
        isDragging.value = true;
    }).onUpdate((event) => {
        const positionX = event.x;
        const pointedUnit = positionX % (size + spacing);
        const inBetween = pointedUnit > size;
        if (inBetween) return;
        const nthTappedStar = Math.floor(positionX / (size + spacing));
        let calculatedTappedHalfStar;
        if (nthTappedStar === 0) calculatedTappedHalfStar = pointedUnit >= size * 0.66 ? 1 : pointedUnit > size * 0.33 ? 0.5 : 0;
        else calculatedTappedHalfStar = pointedUnit >= size / 2 ? 1 : 0.5;
        const calculatedRating = nthTappedStar + calculatedTappedHalfStar;
        const sanitizedCalculatedRating = Math.max(Math.min(maxRating, Math.min(maxRating, calculatedRating)), DEFAULT_VALUE);
        if (currentRating.value != sanitizedCalculatedRating) {
            currentRating.value = sanitizedCalculatedRating;
            runOnJS(Haptics.selectionAsync)();
        }
    }).onTouchesUp(() => {
        isDragging.value = false;
        runOnJS(handleChange)(currentRating.value);
    });
    useEffect(() => {
        currentRating.value = rating || DEFAULT_VALUE;
    }, [rating]);
    const tapAndPanGesture = Gesture.Simultaneous(tapGesture, panGesture);
    if (disabled) return <HStack style={[{ gap: spacing, position: "relative" }, props.style]} >
        {Array.from({ length: maxRating }).map((_, i) => (
            <StarElement key={i} index={i} size={size} rating={currentRating} dragging={isDragging} />
        ))}
    </HStack>;
    return <GestureDetector gesture={tapAndPanGesture}>
        <HStack style={[{ gap: spacing, position: "relative" }, props.style]} >
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
const MAX_SWELL_STROKE_WIDTH = 1.7;
const STAR_VIEWBOX_WIDTH = 24;

export const StarElement = (props: StarElementProps) => {
    const fillTransition = useDerivedValue(() => {
        return withSpring(props.rating.value >= props.index + 1 ? 1 : props.rating.value >= props.index + 0.5 ? 0.5 : 0);
    });
    const swellTransition = useDerivedValue(() => {
        if (!props.dragging.value) return withSpring(0);
        const distance = Math.abs(props.index - props.rating.value);
        const normalizedDistance = (MAX_SWELL_DISTANCE - distance) / MAX_SWELL_DISTANCE;
        return withSpring(normalizedDistance);
    });
    const animatedStrokeProps = useAnimatedProps<React.ComponentProps<typeof AnimatedPath>>(() => ({
        strokeWidth: interpolate(swellTransition.value, [0, 1], [1, MAX_SWELL_STROKE_WIDTH], Extrapolation.CLAMP),
    }));
    const animatedMaskedPathProps = useAnimatedProps<React.ComponentProps<typeof AnimatedPath>>(() => ({
        d: `M0 0 0 0 l${interpolate(fillTransition.value, [0, 1], [0, STAR_VIEWBOX_WIDTH], Extrapolation.CLAMP)} 0 0 0 l0 23 0 0 l0 0 -${interpolate(fillTransition.value, [0, 1], [0, STAR_VIEWBOX_WIDTH], Extrapolation.CLAMP)} 0 z`
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