import { createIcon } from "@gluestack-ui/themed";
import { Path } from "react-native-svg";

const StarIcon = createIcon({
    viewBox: "0 0 18 17",
    fill: "none",
    path: (
        <Path
            fill="currentColor"
            d="M14.037 16.623a.57.57 0 01-.335-.107l-4.587-3.33-4.586 3.33a.57.57 0 01-.876-.645l1.79-5.306L.805 7.382a.571.571 0 01.321-1.043h5.72L8.573 1.02a.571.571 0 011.085 0l1.726 5.32h5.72a.57.57 0 01.322 1.044l-4.637 3.181 1.787 5.304a.572.572 0 01-.54.754z"
        ></Path>
    ),
});

export default StarIcon;