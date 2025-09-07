import { createIcon } from "@gluestack-ui/themed";
import { Path } from "react-native-svg";

const PinIcon = createIcon({
    viewBox: "0 0 10 15",
    fill: "none",
    path: (
        <Path
            fill="currentColor"
            d="M4.667 7.167a1.667 1.667 0 110-3.334 1.667 1.667 0 010 3.334zm0-6.334A4.667 4.667 0 000 5.5c0 3.5 4.667 8.667 4.667 8.667S9.333 9 9.333 5.5A4.667 4.667 0 004.667.833z"
        ></Path>
    ),
});

export default PinIcon;