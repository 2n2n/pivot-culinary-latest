import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import {
  GluestackUIProvider,
  ModeType,
} from "@/components/ui/gluestack-ui-provider";
import "@/global.css";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}
import { createContext, useContext } from "react";

// Create context for color mode
interface ColorModeContextType {
  colorMode: ModeType;
  setColorMode: (mode: ModeType) => void;
}

const ColorModeContext = createContext<ColorModeContextType | undefined>(
  undefined
);

// Hook to use the color mode context
export const useColorMode = () => {
  const context = useContext(ColorModeContext);
  if (context === undefined) {
    throw new Error("useColorMode must be used within a ColorModeProvider");
  }
  return context;
};

function RootLayoutNav() {
  const [colorMode, setColorMode] = useState<ModeType>("light");

  return (
    <ColorModeContext.Provider value={{ colorMode, setColorMode }}>
      <GluestackUIProvider mode={colorMode}>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(application)" options={{ headerShown: false }} />
          <Stack.Screen name="landing" options={{ headerShown: false }} />
        </Stack>
      </GluestackUIProvider>
    </ColorModeContext.Provider>
  );
}
