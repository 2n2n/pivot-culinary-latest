import { createIcon } from "@gluestack-ui/themed";
import { Path, Rect } from "react-native-svg";

const CircledChatIcon = createIcon({
    viewBox: "0 0 30 30",
    fill: "none",
    path: (<>
        <Rect
            width={28.308}
            height={28}
            x={0.692}
            y={1}
            stroke="currentColor"
            rx={14}
        ></Rect>
        <Path
            stroke="currentColor"
            d="M8.192 21v1.029l.81-.636 2.605-2.047h8.778a1.116 1.116 0 001.115-1.115V9.615A1.115 1.115 0 0020.385 8.5H9.308a1.115 1.115 0 00-1.116 1.115V21zm4.308-6.961h-.23v-.231h.23v.23zm2.462 0h-.231v-.231h.23v.23zm2.461 0h-.23v-.231h.23v.23z"
        ></Path>
    </>),
})

export default CircledChatIcon;