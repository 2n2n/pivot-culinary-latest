import { createIcon } from "@gluestack-ui/themed";
import { Path } from "react-native-svg";

const LogoutIcon = createIcon({
    viewBox: "0 0 12 12",
    fill: "none",
    path: (
        <Path
            fill="currentColor"
            d="M2.1 9.6h1.2v1.2h7.2V1.2H3.3v1.2H2.1V.6a.6.6 0 01.6-.6h8.4a.6.6 0 01.6.6v10.8a.6.6 0 01-.6.6H2.7a.6.6 0 01-.6-.6V9.6zm1.2-4.2h4.2v1.2H3.3v1.8L.3 6l3-2.4v1.8z"
        ></Path>
    )
});

export default LogoutIcon;