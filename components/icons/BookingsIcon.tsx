import { createIcon, Icon } from "@gluestack-ui/themed";
import { Path } from "react-native-svg";

const BookingsIcon = createIcon({
    viewBox: "0 0 18 20",
    width: 20,
    height: 18,
    fill: "none",
    path: (<Path
        d="M16 18H2V7h14m-3-7v2H5V0H3v2H2C.89 2 0 2.89 0 4v14a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2h-1V0m-1 11H9v5h5v-5z"
        fill="currentColor"
    />)
})
export default BookingsIcon;