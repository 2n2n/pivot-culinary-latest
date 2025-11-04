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

  /**
   * Nov. 3, 2025
   *  IMPORTANT: This is one of the most critical component of the app.
   *  This component will handle the global change of isSwitchingApp and isComplete
   *  This will trigger the loading screen to show the correct state.
   *  In order to use this make sure that where you call setIsComplete is set to false.
   *  The useEffect below listens to any changes with the isSwitchingApp and selectedAccount.
   * */
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
          }, 1000);
        } else {
          // enter this statement if the app doesn't need to switch to another location.
          // this will show the current location's switching state.
          setIsCompleted(true);
        }
      }
    }
  }, [selectedAccount, isSwitchingApp]);

  /**
   * Nov 3, 2025
   * IMPORTANT: This state will manage the closing of the fetching state after
   * the fetching or loading of the bookings is complete.
   */
  useEffect(() => {
    if (isSwitchingApp) {
      if (!(bookingsIsFetching && bookingsIsStale && bookingsIsLoading)) {
        // with a brief delay this will trigger the closing of the fetching state.
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
