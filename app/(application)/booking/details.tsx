import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function BookingDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Booking Details
      </Text>
      {id && (
        <Text style={{ fontSize: 16, color: "#666" }}>Booking ID: {id}</Text>
      )}
      <Text style={{ fontSize: 16, marginTop: 20, lineHeight: 24 }}>
        This is the booking details screen. You can access it via the path:
        booking/details
      </Text>
    </View>
  );
}
