import { createIcon } from "@gluestack-ui/themed";
import { Path } from "react-native-svg";

const EditIcon = createIcon({
    viewBox: "0 0 13 13",
    fill: "none",
    path: (
        <Path
            fill="currentColor"
            d="M9.171.998L7.838 2.331H1.333v9.334h9.334V5.159L12 3.826v8.505a.666.666 0 01-.667.667H.667A.666.666 0 010 12.331V1.665A.667.667 0 01.667.998H9.17zm2.486-.6l.943.943-6.129 6.128-.941.002-.001-.944L11.657.398z"
        ></Path>
    )
});

export default EditIcon;