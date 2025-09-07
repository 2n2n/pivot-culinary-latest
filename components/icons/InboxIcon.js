import { createIcon } from "@gluestack-ui/themed";
import { Path } from "react-native-svg";

const InboxIcon = createIcon({
    viewBox: "0 0 18 16",
    fill: "none",
    path: (<Path
        fill="currentColor"
        d="M1.889 0H16.11l1.757 8.696a.875.875 0 01.02.193V16H.133s-.02-5.644-.02-7.111c0-.065.006-.13.02-.193C.548 6.827 1.89 0 1.89 0zM4.11 2.222l-.889 4.89h3.111s.281 1.385.781 1.885a2.667 2.667 0 004.553-1.886h3.11l-.888-4.889H4.11zm8.964 7.556a4.446 4.446 0 01-8.15 0H2.778v3.555h12.444V9.778h-2.147z"
    ></Path>),
})

export default InboxIcon