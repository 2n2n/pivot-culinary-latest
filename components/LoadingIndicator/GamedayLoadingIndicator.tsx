import { useEffect } from "react";
import Animated, { Easing, Extrapolation, interpolate, useAnimatedProps, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import Svg, { ClipPath, Defs, Mask, Path } from "react-native-svg";

type GamedayLoadingIndicatorProps = {
    size: number;
}

const VIEWBOX_WIDTH = 886;
const VIEWBOX_HEIGHT = 505;
const VIEWBOX_RATIO = VIEWBOX_WIDTH / VIEWBOX_HEIGHT;
const VIEWBOX_VALUE = `0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`;
const STROKE_LENGTH = 2520 // from path length calculators

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function GamedayLoadingIndicator(props: GamedayLoadingIndicatorProps) {
    const color = "#009d51";
    const transition = useSharedValue(0);
    const animatedPathProps = useAnimatedProps<React.ComponentProps<typeof AnimatedPath>>(() => ({
        strokeDasharray: `${STROKE_LENGTH} ${interpolate(transition.value, [0, 1], [0, STROKE_LENGTH / 3], Extrapolation.CLAMP)}`,
        strokeDashoffset: interpolate(transition.value, [0, 1], [STROKE_LENGTH, 0])
    }));
    useEffect(() => {
        transition.value = withRepeat(withTiming(1, { duration: 700}), -1);
        return () => {
            transition.value = 0;
        }
    }, []);
    return <Svg height={props.size} width={props.size * VIEWBOX_RATIO} viewBox={VIEWBOX_VALUE} fill="none">
        <Defs>
            <Mask id="gameday-mask" x="0" y="0" width={VIEWBOX_WIDTH} height={VIEWBOX_HEIGHT} >
                <Path d="M176.5 295C174.1 299.8 178.833 302.667 181.5 303.5H302L252 403.5H233C188.667 403.167 100 372.5 100 252.5C100 132.5 190.667 102.5 236 102.5H588L639.5 0H226C204.5 0 0 20.5 0 257C0 446.2 149 501.167 223.5 505H324.5C373 408.333 470.5 214 472.5 210C475 205 471 202 467.5 202H226C223.6 202 221.667 204.667 221 206L176.5 295Z" fill="white"/>
                <Path d="M683.5 1.5L633.5 100.5C690.5 100.5 784 124 784 253C784 382 668 402 647 402H419L367 504.5H641.5C671 504.5 886 483.5 886 253C886 68.6 751 8.5 683.5 1.5Z" fill="white"/>
            </Mask>
        </Defs>
        <Path d="M176.5 295C174.1 299.8 178.833 302.667 181.5 303.5H302L252 403.5H233C188.667 403.167 100 372.5 100 252.5C100 132.5 190.667 102.5 236 102.5H588L639.5 0H226C204.5 0 0 20.5 0 257C0 446.2 149 501.167 223.5 505H324.5C373 408.333 470.5 214 472.5 210C475 205 471 202 467.5 202H226C223.6 202 221.667 204.667 221 206L176.5 295Z" fill={color}/>
        <Path d="M683.5 1.5L633.5 100.5C690.5 100.5 784 124 784 253C784 382 668 402 647 402H419L367 504.5H641.5C671 504.5 886 483.5 886 253C886 68.6 751 8.5 683.5 1.5Z" fill={color}/>   
        <AnimatedPath 
            mask="url(#gameday-mask)"
            d="M173 265H395L295 470.5C207.5 470.5 60 441 60 265 60 122 151.5 60.5 241.5 60.5H653C757.5 60.5 849.5 131.5 849.5 265 849.5 398.5 740 470.5 653 470.5 583.4 470.5 385.333 470.5 297.5 470.5"  
            stroke="white"
            strokeLinejoin="miter"
            strokeWidth={120} 
            strokeDasharray={STROKE_LENGTH}
            strokeDashoffset="0"
            animatedProps={animatedPathProps}
        />
    </Svg>
}