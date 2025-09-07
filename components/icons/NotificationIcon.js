import { createIcon } from "@gluestack-ui/themed";
import { Path } from "react-native-svg";

const NotificationIcon = createIcon({
    viewBox: "0 0 16 17",
    fill: "none",
    path: (
        <Path
            d="M14.302 10.238h1.27v2.286H.332v-2.286H1.73v-3.81c0-1.616.77-3.166 1.912-4.31a6.095 6.095 0 018.62 0c1.143 1.144 2.04 2.694 2.04 4.31v3.81zm-2.286 0v-3.81c0-.761-.381-1.708-1.143-2.47-.762-.762-1.708-1.339-2.92-1.339-1.213 0-2.228.773-2.794 1.339-.566.566-1.143 1.709-1.143 2.47v3.81h8zm-6.35 3.81h4.572v2.285H5.667v-2.285z"
            fill="currentColor"
        />
    ),
});

export default NotificationIcon;
