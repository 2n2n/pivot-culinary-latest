import React, { useState, useCallback } from "react";
import { FlatList, View, StyleSheet } from "react-native";
import TabDashboardHeader from "@/components/shared/TabDashboardHeader";
import TabSafeAreaView from "@/components/shared/TabSafeAreaView";
import { Text } from "@/components/Themed";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Calendar, MapPin } from "lucide-react-native";
import { Box } from "@/components/ui/box";

// Sample data for bookings
interface BookingItem {
  id: string;
  title: string;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "cancelled";
  clientName: string;
  service: string;
}

const generateSampleBookings = (): BookingItem[] => {
  const services = [
    "Private Chef",
    "Catering",
    "Cooking Class",
    "Meal Prep",
    "Wine Tasting",
  ];
  const statuses: ("confirmed" | "pending" | "cancelled")[] = [
    "confirmed",
    "pending",
    "cancelled",
  ];
  const clients = [
    "John Smith",
    "Sarah Johnson",
    "Mike Davis",
    "Emily Wilson",
    "David Brown",
  ];

  return Array.from({ length: 50 }, (_, index) => ({
    id: `booking-${index + 1}`,
    title: `Booking #${index + 1}`,
    date: new Date(Date.now() + index * 24 * 60 * 60 * 1000).toDateString(),
    time: `${9 + (index % 12)}:${index % 2 === 0 ? "00" : "30"}`,
    status: statuses[index % statuses.length],
    clientName: clients[index % clients.length],
    service: services[index % services.length],
  }));
};

export default function ApplicationBookingsScreen() {
  const [bookings, setBookings] = useState<BookingItem[]>(
    generateSampleBookings()
  );
  const [isLoading, setIsLoading] = useState(false);

  // Function to load more data for continuous scroll
  const loadMoreBookings = useCallback(() => {
    if (isLoading) return;

    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const newBookings = generateSampleBookings().map((booking, index) => ({
        ...booking,
        id: `booking-${bookings.length + index + 1}`,
        title: `Booking #${bookings.length + index + 1}`,
      }));

      setBookings((prevBookings) => [...prevBookings, ...newBookings]);
      setIsLoading(false);
    }, 1000);
  }, [bookings.length, isLoading]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const TextWithIcon = ({
    icon,
    text,
  }: {
    icon: React.ComponentType<any>;
    text: string;
  }) => {
    return (
      <View className="flex-row items-center py-1">
        <Icon as={icon} className="w-5 h-5 text-orange-500 mr-2" />
        <Text className="text-sm font-medium text-blue-900">{text}</Text>
      </View>
    );
  };
  const renderBookingCard = ({ item }: { item: BookingItem }) => (
    <Card
      size="md"
      variant="elevated"
      className="mb-4 mx-4 shadow-sm rounded-[8px]"
    >
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-xl font-semibold text-gray-900">
          Chicago Bulls @ Kansas City, MO
        </Text>
      </View>

      <View>
        <TextWithIcon icon={Calendar} text={`${item.date} – ${item.date}`} />
      </View>

      <View className="flex-row justify-between items-center">
        <TextWithIcon
          icon={MapPin}
          text="Kauffman Stadium: 1 Royal Way, Kansas City, MO 64129"
        />
      </View>
    </Card>
  );

  const renderFooter = () => {
    if (!isLoading) return null;

    return (
      <View className="py-4 items-center">
        <Text className="text-gray-500">Loading more bookings...</Text>
      </View>
    );
  };

  return (
    <TabSafeAreaView>
      <TabDashboardHeader title="Bookings" />
      <FlatList
        className="pt-5"
        data={bookings}
        renderItem={renderBookingCard}
        keyExtractor={(item) => item.id}
        onEndReached={loadMoreBookings}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        getItemLayout={(data, index) => ({
          length: 120, // Approximate height of each card
          offset: 120 * index,
          index,
        })}
      />
    </TabSafeAreaView>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 20,
  },
});
