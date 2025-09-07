import { createIcon } from "@gluestack-ui/themed";
import Svg, { Path } from "react-native-svg";

const BackIcon = createIcon({
    viewBox: "0 0 12 13",
    width: 12,
    height: 13,
    fill: "none",
    path: (
        <Path
            stroke="currentColor"
            fill="none"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.25 6.5H.75M6 11.75L.75 6.5 6 1.25"
        />
    ),
});

export default BackIcon;
