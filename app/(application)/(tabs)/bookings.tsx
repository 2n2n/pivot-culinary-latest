import React from "react";
import { FlatList, View, StyleSheet, Pressable } from "react-native";
import TabDashboardHeader from "@/components/shared/TabDashboardHeader";
import TabSafeAreaView from "@/components/shared/TabSafeAreaView";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Calendar1, Inbox, MapPin, Wifi } from "lucide-react-native";
import { Link } from "expo-router";
import TextWithIcon from "@/components/shared/TextWithIcon";
import useBookings from "@/hooks/useBookings";
import { useModal } from "@/services/account_modal/hooks/useModal";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { findBookingAddress, formatFullDate } from "@/helpers";
// Sample data for bookings

export default function ApplicationBookingsScreen() {
  const { selectedAccount } = useModal();

  const { data: userBookings, isLoading: bookingIsLoading } =
    useBookings(selectedAccount);

  const renderBookingCard = ({ item }: { item: Booking }) => {
    return (
      <Link
        push
        href={{
          pathname: `/booking-details/${item.id.toString()}`,
          params: { item: JSON.stringify(item) },
        }}
        asChild
      >
        <Pressable>
          <Card
            size="md"
            variant="elevated"
            className="mb-4 mx-4 shadow-sm rounded-[8px]"
          >
            <Box className="flex-row justify-between items-start mb-2">
              <Text className="text-xl font-semibold text-gray-900">
                {item.name}
              </Text>
            </Box>

            <Box>
              <TextWithIcon
                icon={Calendar1}
                text={`${formatFullDate(item.start_date)} – ${formatFullDate(
                  item.end_date || ""
                )}`}
              />
            </Box>

            <Box className="flex-row justify-between items-center">
              <TextWithIcon
                icon={MapPin}
                text={findBookingAddress(item.custom_fields || [])}
              />
            </Box>
          </Card>
        </Pressable>
      </Link>
    );
  };

  const renderFooter = () => {
    if (!bookingIsLoading) return null;

    return (
      <View className="py-4 items-center">
        <Text className="text-gray-500">Loading more bookings...</Text>
      </View>
    );
  };

  const renderEmptyState = () => {
    return (
      <VStack className="flex-1 gap-4 items-center justify-center h-full">
        {/* Central Illustration */}
        <View className="relative items-center justify-center">
          {/* Wi-Fi Signal Icon */}
          <View className="mb-2">
            <Inbox size={64} color="#D1D5DB" strokeWidth={1.5} />
          </View>
        </View>

        {/* Text Content */}
        <VStack className="gap-1 items-center">
          <Text className="text-2xl font-semibold text-gray-300">
            No bookings yet!
          </Text>
          <Text className="text-base text-gray-400 text-center max-w-[80%]">
            We didn't find any bookings for{" "}
            <Text className="font-bold text-gray-400">
              {selectedAccount?.name}
            </Text>{" "}
            check again later.
          </Text>
        </VStack>
      </VStack>
    );
  };

  return (
    <TabSafeAreaView>
      <TabDashboardHeader title="Bookings" />
      <FlatList
        className="pt-5"
        data={userBookings || []}
        renderItem={renderBookingCard}
        keyExtractor={(item) => item.id?.toString() ?? ""}
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
        ListEmptyComponent={renderEmptyState}
      />
    </TabSafeAreaView>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 20,
    flex: 1,
  },
});
