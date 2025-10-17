import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

/**
 * TabSafeAreaView Component
 *
 * Used to offset the header position from tab headers.
 * Initially used in the dashboard tab screens to ensure proper
 * spacing and layout when custom headers are displayed.
 */

const TabSafeAreaView = ({ children }: { children: React.ReactNode }) => {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView
      className="flex-1 flex "
      style={{ paddingTop: -insets.top, paddingBottom: -insets.bottom }}
    >
      {children}
    </SafeAreaView>
  );
};

export default TabSafeAreaView;
