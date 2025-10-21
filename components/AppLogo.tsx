import { forwardRef } from "react";
import { Image } from "expo-image";
import type { ModeType } from "@/components/ui/gluestack-ui-provider";

const GAMEDAY_PRIMARY = require("@/assets/images/primaries/gameday-primary.png");
const PIVOT_PRIMARY = require("@/assets/images/primaries/pivot-primary.png");

type AppLogoProps = {
  theme: ModeType;
  className?: string;
};

/**
 * AppLogo - Displays the application's primary logo depending on theme.
 *
 * @param props.theme - Current color mode ('light'|'dark')
 * @param props.className - Additional Tailwind/Nativewind className string for styling
 * @param ref - Forwarded ref to the underlying Image component
 */
// DOCS: Add JSDoc comments for this function explaining parameters and return value
const AppLogo = forwardRef(function AppLogo(
  props: AppLogoProps,
  ref: React.Ref<Image>
) {
  return (
    <Image
      ref={ref}
      source={props.theme === "light" ? PIVOT_PRIMARY : GAMEDAY_PRIMARY}
      contentFit="contain"
      alt="Application Primary"
      className="w-[80%] h-[200px]"
    />
  );
});

export default AppLogo;
