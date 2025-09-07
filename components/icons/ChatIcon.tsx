import { createIcon } from "@gluestack-ui/themed";
import { Path, } from "react-native-svg";

const ChatIcon = createIcon({
    viewBox: "0 0 15 16",
    fill: "none",
    path: (
        <Path
            stroke="currentColor"
            d="M1.192 13v1.029l.81-.636 2.605-2.047h8.778a1.116 1.116 0 001.115-1.115V1.615A1.115 1.115 0 0013.385.5H2.308a1.115 1.115 0 00-1.116 1.115V13zM5.5 6.038h-.23v-.23h.23v.23zm2.462 0H7.73v-.23h.23v.23zm2.461 0h-.23v-.23h.23v.23z"
        ></Path>
    ),
});

export default ChatIcon;