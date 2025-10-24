import { ModeType } from "@/components/ui/gluestack-ui-provider";
import { createContext, useState } from "react";
import ThemedLoaderScreen from "./components/ThemedLoadingScreen";
import { DEFAULT_COLOR_MODE } from "@/app/_layout";

const mockAccount = {
  name: "Raccoons FC",
  avatar:
    "https://plus.unsplash.com/premium_photo-1723600867732-a925c995c888?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHNxdWFyZSUyMHBvcnRyYWl0fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=900",
  theme: "Pivot Culinary & Gameday",
  alias: "RFC",
};

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
        account={mockAccount}
      >
        {children}
      </ThemedLoaderScreen>
    </ThemeLoaderScreenContext.Provider>
  );
};

export default ThemeLoaderScreenProvider;
