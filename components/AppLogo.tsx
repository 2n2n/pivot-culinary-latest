import { forwardRef } from "react";
import { Image } from "expo-image";
import type { ModeType } from "@/components/ui/gluestack-ui-provider";

const GAMEDAY_PRIMARY = require("@/assets/images/primaries/gameday-primary.png");
const PIVOT_PRIMARY = require("@/assets/images/primaries/pivot-primary.png");

// The main issue: TypeScript's type signature for forwardRef is incorrect here.
// Instead of `forwardRef<Image, Props>`, you should use `forwardRef<Props, RefType>(...)`
// (or use generics as `forwardRef<Props, RefType>` if using the latest versions),
// but in practice, you should use `forwardRef((props, ref: React.Ref<Image>) => ...`
// *and* annotate the props separately, not as a generic in forwardRef.
// See: https://react.dev/reference/react/forwardRef#usage-with-typescript

type AppLogoProps = {
  theme: ModeType;
  className?: string;
};

const AppLogo = forwardRef<Image, AppLogoProps>((props, ref) => {
  // <-- wrong usage (this is not how forwardRef is typed)
  return (
    <Image
      ref={ref}
      source={props.theme === "light" ? PIVOT_PRIMARY : GAMEDAY_PRIMARY}
      contentFit="contain"
      alt="Application Primary"
      className={props.className}
    />
  );
});

export default AppLogo;

// The correct version would look like this:
//
// const AppLogo = forwardRef<Image, AppLogoProps>( // WRONG typing!
//   (props, ref) => ( ... )
// );
//
// Should be:
// const AppLogo = forwardRef(
//   (props: AppLogoProps, ref: React.Ref<Image>) => ( ... )
// );
//
// Or, if you want to type the component:
// const AppLogo = forwardRef<Image, AppLogoProps>(...) as ForwardRefExoticComponent<AppLogoProps & RefAttributes<Image>>;
