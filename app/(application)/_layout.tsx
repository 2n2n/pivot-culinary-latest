import { Stack } from "expo-router";

export default function ApplicationLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          headerTitle: "Home",
        }}
      />
      <Stack.Screen
        name="booking-details/[bookingId]"
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTintColor: "#fff",
          headerBackVisible: true,
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
      <Stack.Screen
        name="event-details/[eventId]"
        options={{
          headerTransparent: true,
          headerShown: true,
          headerBackVisible: true,
          headerTitle: "Event Details",
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
      <Stack.Screen
        name="feedback/[eventId]"
        options={{
          headerShown: true,
          headerTintColor: "#000",
          headerBackVisible: true,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#FFFFFF" },
        }}
      />
    </Stack>
  );
}
