import { createIcon } from "@gluestack-ui/themed";
import { Path } from "react-native-svg";

const OrderIcon = createIcon({
    viewBox: "0 0 15 17",
    fill: "none",
    path: (
        <Path
            fill="currentColor"
            d="M13.9 16.625H1.1a.8.8 0 01-.8-.8v-14.4a.8.8 0 01.8-.8h12.8a.8.8 0 01.8.8v14.4a.8.8 0 01-.8.8zm-9.6-12v1.6h6.4v-1.6H4.3zm0 3.2v1.6h6.4v-1.6H4.3zm0 3.2v1.6h4v-1.6h-4z"
        ></Path>
    ),
});

export default OrderIcon;