// @ts-nocheck
import { Icon } from "@/components/ui/icon";
import {
  Inbox,
  Bell,
  CalendarCheck,
  CalendarDays,
  Notebook,
} from "lucide-react-native";
import { createIcon } from "@gluestack-ui/core/icon/creator";
import { Tabs } from "expo-router";
import { useColorMode } from "@/app/_layout";
// REVIEW: Understand why we are calling the Svg component directly instead of calling it via the Icon component <Icon as={BookingsIcon} />
export default function TabsLayout() {
  const { colorMode } = useColorMode(); // Get current theme mode (e.g., "light" or "dark")
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: colorMode === "light" ? "#E07C20" : "#009D51",
      }}
    >
      <Tabs.Screen
        name="agenda"
        options={{
          title: "Agenda",
          headerTitleStyle: { opacity: 0 },
          tabBarIcon: ({ focused, color }) => (
            <Icon as={CalendarDays} style={{ color }} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          headerBackVisible: true,
          headerTitleAlign: "center",
          headerTitleStyle: { opacity: 0 },
          tabBarIcon: ({ color }) => <Icon as={Notebook} style={{ color }} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          headerTitleStyle: { opacity: 0 },
          tabBarIcon: ({ color }) => <Icon as={Bell} style={{ color }} />,
        }}
      />
    </Tabs>
  );
}
