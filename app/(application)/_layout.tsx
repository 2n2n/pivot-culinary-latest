import CalendarIcon from "@/components/icons/CalendarIcon";
import { Icon } from "@/components/ui/icon";
import { Tabs } from "expo-router";

export default function ApplicationLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="agenda"
        options={{
          title: "Agenda",
          headerShown: false,
          tabBarIcon: ({ color }) => <Icon as={CalendarIcon} color="green" />,
        }}
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
