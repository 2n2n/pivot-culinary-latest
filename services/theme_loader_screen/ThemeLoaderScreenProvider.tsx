import { ModeType } from "@/components/ui/gluestack-ui-provider";
import { createContext, useState } from "react";
import ThemedLoaderScreen from "./components/ThemedLoadingScreen";
import { DEFAULT_COLOR_MODE } from "@/app/_layout";
import { useModal } from "../account_modal/hooks/useModal";

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

  const { selectedAccount } = useModal();
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
        account={selectedAccount as Account}
      >
        {children}
      </ThemedLoaderScreen>
    </ThemeLoaderScreenContext.Provider>
  );
};

export default ThemeLoaderScreenProvider;
