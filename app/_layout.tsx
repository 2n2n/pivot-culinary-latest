import "@/global.css";

import {
  GluestackUIProvider,
  ModeType,
} from "@/components/ui/gluestack-ui-provider";
import ThemedLoaderScreen from "@/components/LoadingIndicator/ThemedLoadingScreen";

import { useEffect, useState, createContext, useContext, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "react-native-reanimated";
<<<<<<< HEAD
import { AppState, Platform } from "react-native";
import type { AppStateStatus } from "react-native";
import {
  onlineManager,
  focusManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import * as Network from "expo-network";
import { AccountModalProvider } from "@/services/account_modal/AccountModalProvider";
import { AuthProvider } from "@/services/auth/AuthProvider";
=======
>>>>>>> b07f567 (refactored loading screen)

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// add online manager for Online status management
onlineManager.setEventListener((setOnline) => {
  const eventSubscription = Network.addNetworkStateListener((state) => {
    setOnline(!!state.isConnected);
  });
  return eventSubscription.remove;
});

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;
  else return <RootLayoutNav />;
}
// Create context for color mode
interface ColorModeContextType {
  colorMode: ModeType;
  setColorMode: (mode: ModeType) => void;
}

const ColorModeContext = createContext<ColorModeContextType | undefined>(
  undefined
);

const queryClient = new QueryClient();

// Hook to use the color mode context
export const useColorMode = () => {
  const context = useContext(ColorModeContext);
  if (context === undefined)
    throw new Error("useColorMode must be used within a ColorModeProvider");
  return context;
};

<<<<<<< HEAD
=======
export const MockAccountSwitch = () => {};

>>>>>>> b07f567 (refactored loading screen)
const DEFAULT_COLOR_MODE = "light";

function RootLayoutNav() {
  const [colorMode, setColorMode] = useState<ModeType>(DEFAULT_COLOR_MODE);
  //** IMPLEMENTATION FOR THEMED LOADER SCREEN */
  // TODO: Match implementation to actual acc and theme switching logic
  const prevColorMode = useRef<ModeType>(DEFAULT_COLOR_MODE); // Placeholder ref for preventing unnecessary re-renders on colorMode
  const [isSwitchingApp, setIsSwitchingApp] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const mockAccount = {
    name: "Raccoons FC",
    avatar:
      "https://plus.unsplash.com/premium_photo-1723600867732-a925c995c888?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHNxdWFyZSUyMHBvcnRyYWl0fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=900",
    theme: "Pivot Culinary & Gameday",
    alias: "RFC",
  };
  useEffect(() => {
    if (prevColorMode.current === colorMode) return;
    prevColorMode.current = colorMode;
    setIsCompleted(false); // Triggers Fade out of the themed loader screen
    setIsSwitchingApp(true); // Triggers Fade in of the themed loader screen
    setTimeout(() => {
      setIsCompleted(true); // Triggers display of the current theme
    }, 2000);
    setTimeout(() => {
      setIsSwitchingApp(false);
    }, 4000);
  }, [colorMode]);

  //** IMPLEMENTATION FOR THEMED LOADER SCREEN */

  // TODO: Polish this screen
  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => subscription.remove();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <ColorModeContext.Provider value={{ colorMode, setColorMode }}>
        <GestureHandlerRootView className="flex-1">
          <GluestackUIProvider mode={colorMode}>
            <AuthProvider>
              <AccountModalProvider>
                {/** //* THEMED LOADER SCREEN */}
                <ThemedLoaderScreen
                  theme={colorMode}
                  switching={isSwitchingApp}
                  completed={isCompleted}
                  account={mockAccount}
                >
                  <Stack>
                    <Stack.Screen
                      name="(auth)"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="(application)"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="landing"
                      options={{ headerShown: false }}
                    />
                  </Stack>
                </ThemedLoaderScreen>
              </AccountModalProvider>
            </AuthProvider>
          </GluestackUIProvider>
        </GestureHandlerRootView>
      </ColorModeContext.Provider>
    </QueryClientProvider>
  );
}
