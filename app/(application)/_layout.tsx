// @ts-nocheck
import { Icon } from "@/components/ui/icon";
import { Inbox, Bell, CalendarCheck, CalendarDays } from "lucide-react-native";
import { createIcon } from "@gluestack-ui/core/icon/creator";
import { Tabs } from "expo-router";
// REVIEW: Understand why we are calling the Svg component directly instead of calling it via the Icon component <Icon as={BookingsIcon} />
export default function ApplicationLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#F47C20",
      }}
    >
      <Tabs.Screen
        name="agenda"
        options={{
          title: "Agenda",
          tabBarIcon: ({ focused, color }) => (
            <Icon as={CalendarDays} style={{ color }} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ color }) => (
            <Icon as={CalendarCheck} style={{ color }} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({ color }) => <Icon as={Bell} style={{ color }} />,
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: "Inbox",
          tabBarIcon: ({ color }) => <Icon as={Inbox} style={{ color }} />,
        }}
      />
    </Tabs>
  );
}
