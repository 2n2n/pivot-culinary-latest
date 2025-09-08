// @ts-nocheck
import {
  BellIcon,
  CalendarDaysIcon,
  EditIcon,
  MailIcon,
  Icon,
} from "@/components/ui/icon";
import { createIcon } from "@gluestack-ui/core/icon/creator";
import { Tabs } from "expo-router";
/**
 * TODO: Understand why we are calling the Svg component directly instead of calling it via the Icon component <Icon as={BookingsIcon} />
 */
export default function ApplicationLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "orange",
      }}
    >
      <Tabs.Screen
        name="agenda"
        options={{
          title: "Agenda",
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <Icon as={CalendarDaysIcon} style={{ color }} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          headerShown: false,
          tabBarIcon: ({ color }) => <Icon as={EditIcon} style={{ color }} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          headerShown: false,
          tabBarIcon: ({ color }) => <Icon as={BellIcon} style={{ color }} />,
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: "Inbox",
          headerShown: false,
          tabBarIcon: ({ color }) => <Icon as={MailIcon} style={{ color }} />,
        }}
      />
    </Tabs>
  );
}
