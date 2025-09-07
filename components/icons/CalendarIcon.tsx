import { createIcon } from "@/components/ui/icon";
import { Path } from "react-native-svg";

const CalendarIcon = createIcon({
  viewBox: "0 0 12 15",
  path: (
    <Path
      fill="currentColor"
      d="M10.667 12.833H1.333V5.5h9.334m-2-4.667v1.334H3.333V.833H2v1.334h-.667C.593 2.167 0 2.76 0 3.5v9.333a1.333 1.333 0 001.333 1.334h9.334A1.333 1.333 0 0012 12.833V3.5a1.333 1.333 0 00-1.333-1.333H10V.833m-.667 7.334H6V11.5h3.333V8.167z"
    />
  ),
});

export default CalendarIcon;
