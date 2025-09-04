import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ApplicationLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="agenda"
        options={{ title: "Agenda", headerShown: false }}
      />
      <Tabs.Screen
        name="bookings"
        options={{ title: "Bookings", headerShown: false }}
      />
      <Tabs.Screen
        name="notifications"
        options={{ title: "Notifications", headerShown: false }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: "Settings", headerShown: false }}
      />
      <Tabs.Screen
        name="inbox"
        options={{ title: "Inbox", headerShown: false }}
      />
    </Tabs>
  );
}
