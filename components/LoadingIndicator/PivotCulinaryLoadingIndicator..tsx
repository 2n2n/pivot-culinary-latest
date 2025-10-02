import Animated, { Easing, interpolate, useAnimatedProps, useSharedValue, withRepeat, withSequence, withSpring, withTiming } from "react-native-reanimated";
import Svg, { Defs, Mask, Path } from "react-native-svg";
import { useEffect } from "react";

type PivotCulinaryLoadingIndicatorProps = {
    size: number;
}

const VIEWBOX_WIDTH = 58;
const VIEWBOX_HEIGHT = 55;
const VIEWBOX_RATIO = VIEWBOX_WIDTH / VIEWBOX_HEIGHT;
const VIEWBOX_VALUE = `0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`;

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function PivotCulinaryLoadingIndicator(props: PivotCulinaryLoadingIndicatorProps) {
    
    const transition = useSharedValue(0);
    const animatedPathProps = useAnimatedProps<React.ComponentProps<typeof AnimatedPath>>(() => {
        const halfClose = interpolate(transition.value, [0.4, 1], [VIEWBOX_HEIGHT, 0]);
        const halfOpen = interpolate(transition.value, [0, 0.6], [VIEWBOX_HEIGHT, 0]);
        return {
            d: `M0 ${halfOpen} 58 ${halfOpen} 58 ${halfClose} 0 ${halfClose}Z`
        }
    });
    useEffect(() => {
        transition.value = withRepeat(withTiming(1, { duration: 700, easing: Easing.inOut(Easing.quad) }), -1);
        return () => {
            transition.value = 0;
        }
    }, []);
    return <Svg
        width={props.size}
        height={props.size / VIEWBOX_RATIO}
        viewBox={VIEWBOX_VALUE}
    >
        <Defs>
            <Mask id="pivot-mask" x="0" y="0" width={VIEWBOX_WIDTH} height={VIEWBOX_HEIGHT}>
                <Path
                    fill="white"
                    d="M0 54.925L16.948 3.988c.75-2.333 3-3.913 5.474-3.913H36.52L18.298 55H0v-.075zM41.02 0L28.87 36.642H44.62c1.5 0 2.775-.979 3.3-2.333l9.898-29.72c.75-2.257-.9-4.589-3.3-4.589H41.02z"
                />
            </Mask>
        </Defs>
        <Path fill="none" stroke="orange" strokeWidth="1" d="M0 54.925L16.948 3.988c.75-2.333 3-3.913 5.474-3.913H36.52L18.298 55H0v-.075zM41.02 0L28.87 36.642H44.62c1.5 0 2.775-.979 3.3-2.333l9.898-29.72c.75-2.257-.9-4.589-3.3-4.589H41.02z"/>
        <AnimatedPath fill="orange" mask="url(#pivot-mask)" d="M0 0 58 0 58 55 0 55Z" animatedProps={animatedPathProps}/>
    </Svg>
} 