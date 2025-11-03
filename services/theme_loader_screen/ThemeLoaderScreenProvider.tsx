import { ModeType } from "@/components/ui/gluestack-ui-provider";
import { createContext, useContext, useEffect, useState } from "react";
import ThemedLoaderScreen from "./components/ThemedLoadingScreen";
import { DEFAULT_COLOR_MODE, useColorMode } from "@/app/_layout";
import { AccountModalContext } from "../account_modal/AccountModalProvider";
import useBookings from "@/hooks/useBookings";
import { getAccountLocation } from "@/helpers";
import { colorModeMap } from "../account_modal/component/AccountModal";

export const ThemeLoaderScreenContext = createContext<{
  colorMode: ModeType;
  isSwitchingApp: boolean;
  setIsSwitchingApp: (isSwitchingApp: boolean) => void;
  isCompleted: boolean;
  setIsCompleted: (isCompleted: boolean) => void;
}>({
  colorMode: DEFAULT_COLOR_MODE,
  isSwitchingApp: false,
  setIsSwitchingApp: () => {},
  isCompleted: false,
  setIsCompleted: () => {},
});

const ThemeLoaderScreenProvider = ({
  colorMode,
  children,
}: {
  colorMode: ModeType;
  children: React.ReactNode;
}) => {
  const [isSwitchingApp, setIsSwitchingApp] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const { setColorMode } = useColorMode();

  const { selectedAccount } = useContext(AccountModalContext);
  const {
    data: bookings,
    isFetching: bookingsIsFetching,
    isStale: bookingsIsStale,
    isLoading: bookingsIsLoading,
  } = useBookings(selectedAccount);

  // time to listen to the selectedAccount state change.
  useEffect(() => {
    if (isSwitchingApp) {
      if (selectedAccount) {
        const accountLocation = getAccountLocation(selectedAccount);
        if (colorModeMap[colorMode] !== accountLocation) {
          // enter this statement if the app needs to switch to another location.
          setColorMode(accountLocation === "PIVOT" ? "light" : "dark");
          setTimeout(() => {
            // with a brief delay this will trigger the switching state.
            setIsCompleted(true);
          }, 100);
        } else {
          // enter this statement if the app doesn't need to switch to another location.
          // this will show the current location's switching state.
          setIsCompleted(true);
        }
      }
    }
  }, [selectedAccount, isSwitchingApp]);

  // this will trigger the end of the loading screen.
  useEffect(() => {
    if (isSwitchingApp) {
      if (!(bookingsIsFetching && bookingsIsStale && bookingsIsLoading)) {
        setTimeout(() => {
          setIsSwitchingApp(false);
        }, 2000);
      }
    }
  }, [
    isSwitchingApp,
    bookingsIsFetching,
    bookingsIsStale,
    bookingsIsLoading,
    bookings,
  ]);

  return (
    <ThemeLoaderScreenContext.Provider
      value={{
        isSwitchingApp,
        setIsSwitchingApp,
        isCompleted,
        setIsCompleted,
        colorMode,
      }}
    >
      <ThemedLoaderScreen
        theme={colorMode}
        switching={isSwitchingApp}
        completed={isCompleted}
      >
        {children}
      </ThemedLoaderScreen>
    </ThemeLoaderScreenContext.Provider>
  );
};

export default ThemeLoaderScreenProvider;
