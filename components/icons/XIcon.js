import { createIcon } from "@gluestack-ui/themed";
import { Path } from "react-native-svg";

const XIcon = createIcon({
    viewBox: "0 0 16 17",
    fill: "none",
    path: (
        <Path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.625l-8 8M4 4.625l8 8" />
    )
});

export default XIcon;