import { Dimensions, View } from "react-native";
import Animated, { Easing, Extrapolation, interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withDecay, withDelay, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { useEffect } from "react";

type ConfettiCanonProps = {
    origin: "bottom-left" | "bottom-right"
    density?: "light" | "medium" | "heavy"
}

const COLOR_POOL = [
    ["red", "yellow"],
    ["green", "yellow"],
    ["red", "blue"],
    ["pink", "cyan"],
]
const DENSITY_MAP = {
    "light": 12,
    "medium": 25,
    "heavy": 50,
}
const FALL_TIME = 4000;
const LAUNCH_TIME = 1000;
const LAUNCH_TIME_HORIZONTAL_STAGGER = 200;
const REACHABLE_VERTICAL_APEX_FRACTION = 0.75;
const MIN_AIR_FRICTION_FACTOR = 0.1;
const MAX_AIR_FRICTION_FACTOR = 0.5;
const MIN_AIR_FRICTION_SWAY = -100;
const MAX_AIR_FRICTION_SWAY = 100;
const DEFAULT_EASING_FUNCTION = Easing.inOut(Easing.quad);

export default function ConfettiCanon(props: ConfettiCanonProps) {
    return <>
        {
            Array.from({ length: DENSITY_MAP[props.density || "medium"] }).map((_, index) => (
                <ConfettiLine key={index} origin={props.origin || "bottom-right"} />
            ))
        }
    </>
};

const ConfettiLine = (props: ConfettiCanonProps) => {
    const SCREEN_WIDTH = Dimensions.get("window").width;
    const SCREEN_HEIGHT = Dimensions.get("window").height;
    const randomColorInterpolation = interpolateColor(getRandomValue(0, 1), [0, 1], randomlyPick(COLOR_POOL));
    const confettiSize = getRandomValue(4, 8);
    const originX = props.origin === "bottom-right" ? SCREEN_WIDTH : 0;
    const originY = SCREEN_HEIGHT;
    const apexX = randomBoxMuller(0, SCREEN_WIDTH, 1);
    const apexY = randomBoxMuller(0, originY * REACHABLE_VERTICAL_APEX_FRACTION, 1);
    const randomSkewStart= getRandomValue(-45, 45, true);
    const randomSkewEnd = getRandomValue(-60, 60, true);
    const transitionX = useSharedValue(originX);
    const transitionY = useSharedValue(originY);
    const transitionRotation = useSharedValue(0);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            position: "absolute",
            top: originY,
            left: originX,
            // borderRadius: "100%",
            transform: [
                { translateY: transitionY.value - originY },
                { translateX: props.origin === "bottom-right" ? transitionX.value - originX : transitionX.value },
                { skewY: `${interpolate(transitionRotation.value, [0, 1], [randomSkewStart, randomSkewEnd], Extrapolation.CLAMP)}deg` },
                { rotate: `${interpolate(transitionRotation.value, [0, 1], [randomSkewEnd, randomSkewStart], Extrapolation.CLAMP)}deg` },
            ],
            width: confettiSize,
            height: confettiSize,
            backgroundColor: randomColorInterpolation
        }
    });
    useEffect(() => {
        // SPRAY CONFETTI INSTEAD OF FIRING ALL AT ONCE
        const delay = getRandomValue(0, 1000); 
        transitionX.value = withDelay(delay, withSequence(
            // LAUNCH HORIZONTAL MOVEMENT
            withTiming(
                apexX, 
                { 
                    duration: LAUNCH_TIME + LAUNCH_TIME_HORIZONTAL_STAGGER, 
                    easing: DEFAULT_EASING_FUNCTION
                }
            ), 
            // SIMULATE SWAYING IN THE AIR WHILE FALLING
            withTiming(
                apexX + getRandomValue(MIN_AIR_FRICTION_SWAY, MAX_AIR_FRICTION_SWAY), 
                { duration: FALL_TIME }
            ) 
        ));
        transitionY.value = withDelay(delay, withSequence(
            // LAUNCH VERTICAL MOVEMENT
            withTiming(
                apexY, 
                { duration: LAUNCH_TIME, easing: DEFAULT_EASING_FUNCTION }
            ), 
            // SIMULATE AIR FRICTION ON THE WAY DOWN
            withTiming(
                originY + apexY * getRandomValue(MIN_AIR_FRICTION_FACTOR, MAX_AIR_FRICTION_FACTOR), 
                { duration: FALL_TIME }
            ) 
        ));
        // SIMULATE ROTATION DUE TO AIR FRICTION
        transitionRotation.value = withRepeat(
            withTiming(
                1, 
                { duration: getRandomValue(100, 5000) }
            ),
            -1
        );
        return () => {
            transitionX.value = originX;
            transitionY.value = originY;
            transitionRotation.value = 0;
        }
    }, []);
    return <Animated.View style={animatedStyle}/>
};

const randomlyPick = (array: any[]) => {
    const randomIndex = getRandomValue(0, array.length - 1);
    return array[Math.floor(randomIndex)];
}

const getRandomValue = (min: number, max: number, rounded = false) => {
    const randomValue = Math.random() * (max - min) + min;
    return rounded ? Math.round(randomValue) : randomValue;
}

// see solution: https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
/**
 * Generates a random number using the Box-Muller transform to approximate a normal (Gaussian) distribution,
 * then skews and scales it to fit within the specified range.
 *
 * @param {number} [min=0] - The minimum value of the output range.
 * @param {number} [max=1] - The maximum value of the output range.
 * @param {number} [skew=0.5] - The skew factor to adjust the distribution (values < 1 skew left, > 1 skew right).
 * @param {number} [spread=4.0] - Controls the width of the distribution (higher values = narrower spread).
 * @returns {number} A random number between min and max, distributed and skewed as specified.
 */
function randomBoxMuller(min = 0, max = 1, skew = 0.5, spread = 4.0) {
    let u = 0, v = 0;
    // Use the spread param to control the divisor for distribution width
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

    num = num / spread + 0.5; 
    if (num > 1 || num < 0) {
        num = randomBoxMuller(min, max, skew, spread); 
    } else {
        num = Math.pow(num, skew);
        num *= max - min; 
        num += min; 
    }
    return num;
}