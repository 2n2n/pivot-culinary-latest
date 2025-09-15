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
          headerTintColor: "#fff",
          headerBackVisible: true,
          headerTitle: "Booking Details",
          headerBackTitle: "Booking Details",
          headerTitleStyle: { fontWeight: "bold" },
          headerStyle: { backgroundColor: "#F47C20" },
        }}
      />
    </Stack>
  );
}
