import PivotCulinaryLoadingIndicator from "./PivotCulinaryLoadingIndicator.";
import GamedayLoadingIndicator from "./GamedayLoadingIndicator";
import { useColorMode } from "@/app/_layout";

type LoadingIndicatorProps = {
    size?: "sm" | "md" | "lg";
    trailingColors?: string[];
}

const SIZE_MAP = {
    sm: 32,
    md: 48,
    lg: 64,
}

export default function LoadingIndicator(props: LoadingIndicatorProps) {
    const size = SIZE_MAP[props.size || "md"];
    const { colorMode } = useColorMode();
    if (colorMode === "light") return <PivotCulinaryLoadingIndicator size={size}/>;
    return <GamedayLoadingIndicator size={size}/>;
};
