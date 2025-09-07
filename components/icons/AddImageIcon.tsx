import { createIcon } from "@gluestack-ui/themed";
import { Path } from "react-native-svg";

const AddImageIcon = createIcon({
  viewBox: "0 0 15 14",
  fill: "none",
  path: (
    <Path
      fill="currentColor"
      d="M13 8.625v2h2v1.333h-2v2h-1.333v-2h-2v-1.333h2v-2H13zm.005-8c.366 0 .662.297.662.662v6.005h-1.334V1.958H1.667v9.333l6.666-6.666 2 2v1.886l-2-2-4.782 4.78h4.782v1.334H.995a.662.662 0 01-.662-.662V1.287A.667.667 0 01.995.625h12.01zM4.333 3.292a1.333 1.333 0 110 2.666 1.333 1.333 0 010-2.666z"
    />
  ),
});

export default AddImageIcon;