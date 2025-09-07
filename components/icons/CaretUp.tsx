import { createIcon } from "@gluestack-ui/themed"
import { Path } from "react-native-svg"

const CaretUp = createIcon({
  viewBox: "0 0 13 7",
  fill: "none",
  path: (<Path
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.667"
    d="M11.5 6l-5-5-5 5"
  ></Path>)
});

export default CaretUp;