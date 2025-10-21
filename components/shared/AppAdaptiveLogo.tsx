import { forwardRef } from "react";
import { Image } from "expo-image";
import type { ModeType } from "@/components/ui/gluestack-ui-provider";
import { tv } from "tailwind-variants";
import { useColorScheme } from "nativewind";

const GAMEDAY_PRIMARY = require("@/assets/images/icons/gameday-icon.png");
const PIVOT_PRIMARY = require("@/assets/images/icons/pivot-icon.png");

type ThemeVariant = "light" | "dark";

// Map system or custom ModeType to TVA theme ('light' or 'dark')
function mapTheme(theme: ModeType): ThemeVariant {
  // If your app uses "system" mode, map to "light" as default,
  // or enhance this logic accordingly.
  if (theme === "dark") return "dark";
  return "light";
}

type AppAdaptiveLogoProps = {
  className?: string;
  size?: "xs" | "md" | "lg" | "xl";
};

// TVA utility with conditional size defaults based on theme
const appAdaptiveLogoTVA = tv({
  base: "object-contain",
  variants: {
    theme: {
      light: "", // PIVOT default theme, you may add any extra style
      dark: "", // GAMEDAY default theme, example style
    },
    size: {
      xs: "w-12 h-8", // 48x32px
      md: "w-28 h-16", // 112x64px
      lg: "w-40 h-24", // 160x96px
      xl: "w-72 h-40", // 288x160px
    },
  },
  compoundVariants: [
    // Example: use a larger default for dark theme, or mix and match
    { theme: "dark", size: "md", class: "h-9 w-16" },
    { theme: "dark", size: "lg", class: "w-20 h-16" },
    { theme: "light", size: "md", class: "h-10 w-10" },
    { theme: "light", size: "lg", class: "w-16 h-16" },
  ],
  defaultVariants: {
    size: undefined, // We'll set the fallback in the component logic below
    theme: "light",
  },
});

/**
 * AppAdaptiveLogo - Displays the application's primary logo depending on theme.
 *
 * @param props.theme - Current color mode ('light'|'dark'|'system')
 * @param props.className - Additional Tailwind/Nativewind className string for styling
 * @param props.size - Logo size preset ('xs'|'md'|'lg'|'xl'), defaults depend on theme
 * @param ref - Forwarded ref to the underlying Image component
 */
const AppAdaptiveLogo = forwardRef(function AppAdaptiveLogo(
  props: AppAdaptiveLogoProps,
  ref: React.Ref<Image>
) {
  const { className, size } = props;
  // Use the Appearance API from react-native to get the current theme set by the device
  // DOCS: The `Appearance` API provides access to the user's color scheme preference ('light' or 'dark').

  // Listen to theme changes using a useColorScheme hook to dynamically respond to updates.
  // CHORE: Using useColorScheme ensures the theme updates reactively.
  const theme = useColorScheme().colorScheme || "light";

  // Use theme and compoundVariants in TVA computation
  const computedClassName = appAdaptiveLogoTVA({
    size,
    theme,
    className,
  });

  return (
    <Image
      ref={ref}
      source={theme === "light" ? PIVOT_PRIMARY : GAMEDAY_PRIMARY}
      contentFit="contain"
      alt="Application Primary"
      className={computedClassName}
    />
  );
});

export default AppAdaptiveLogo;
