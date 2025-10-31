import { ModeType } from "@/components/ui/gluestack-ui-provider";
import { createContext, useContext, useEffect, useState } from "react";
import ThemedLoaderScreen from "./components/ThemedLoadingScreen";
import { DEFAULT_COLOR_MODE } from "@/app/_layout";
import { AccountModalContext } from "../account_modal/AccountModalProvider";
import useBookings from "@/hooks/useBookings";

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
  const { selectedAccount } = useContext(AccountModalContext);

  const {
    data: bookings,
    isFetching: bookingsIsFetching,
    isStale: bookingsIsStale,
    isLoading: bookingsIsLoading,
  } = useBookings(selectedAccount);

  useEffect(() => {
    if (!(bookingsIsFetching && bookingsIsStale && bookingsIsLoading)) {
      setTimeout(() => {
        setIsSwitchingApp(false);
      }, 1000);
    }
    console.log(
      "🚀 ~ AccountModalProvider ~ bookingsIsFetching, bookingsIsStale, bookingsIsLoading:",
      bookingsIsFetching,
      bookingsIsStale,
      bookingsIsLoading,
      bookings
    );
  }, [bookingsIsFetching, bookingsIsStale, bookingsIsLoading, bookings]);

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
