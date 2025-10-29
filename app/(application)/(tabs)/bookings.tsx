import React from "react";
import { FlatList, View, StyleSheet, Pressable } from "react-native";
import TabDashboardHeader from "@/components/shared/TabDashboardHeader";
import TabSafeAreaView from "@/components/shared/TabSafeAreaView";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Calendar1, MapPin } from "lucide-react-native";
import { Link } from "expo-router";
import TextWithIcon from "@/components/shared/TextWithIcon";
import useBookings from "@/hooks/useBookings";
import { useModal } from "@/services/account_modal/hooks/useModal";
import { Box } from "@/components/ui/box";
// Sample data for bookings

export default function ApplicationBookingsScreen() {
  const { selectedAccount } = useModal();

  const { data: userBookings, isLoading: bookingIsLoading } =
    useBookings(selectedAccount);

  const renderBookingCard = ({ item }: { item: Booking }) => {
    return (
      <Link push href={`/booking-details/${item.id}`} asChild>
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
                text={`${item.start_date} – ${item.end_date}`}
              />
            </Box>

            <Box className="flex-row justify-between items-center">
              <TextWithIcon
                icon={MapPin}
                text="Kauffman Stadium: 1 Royal Way, Kansas City, MO 64129"
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
      />
    </TabSafeAreaView>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 20,
  },
});
