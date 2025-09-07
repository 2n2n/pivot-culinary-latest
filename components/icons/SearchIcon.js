import { createIcon } from "@gluestack-ui/themed";
import { Path } from "react-native-svg";

const SearchIcon = createIcon({
    viewBox: "0 0 16 15",
    fill: "none",
    path: (<Path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M7.25 12.75a6 6 0 100-12 6 6 0 000 12zM14.75 14.25l-3.262-3.262"
    ></Path>),
});

export default SearchIcon;