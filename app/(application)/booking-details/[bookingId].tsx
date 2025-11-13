import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Image } from "@/components/ui/image";
import { Box } from "@/components/ui/box";
import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";

import { View, Text, ScrollView, Linking } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Calendar1,
  ChevronDown,
  MapPin,
  NotepadText,
  UsersRound,
} from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import { useModal } from "@/services/account_modal/hooks/useModal";
import AccountManagerContact from "@/components/AccountManagerContact";
import { findBookingAddress, formatCurrency, formatFullDate, getBEO } from "@/helpers";
import { useMemo } from "react";

// REVIEW: Screen should be polished.
export default function BookingDetails() {
  const router = useRouter();
  const { item } = useLocalSearchParams<{
    bookingId: string;
    item: string;
  }>();

  const bookingData = useMemo(() => {
    return JSON.parse(item as string);
  }, [item]);

  const beo = useMemo(() => {
    if (bookingData) {
      if (bookingData.documents) {
        return getBEO(bookingData.documents) || null;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }, [bookingData]);

  // TODO: Add proper loading for skeleton view.

  return (
    <>
      <Stack.Screen
        options={{
          headerBackTitle: "Booking Details",
          headerTitle: "",
        }}
      />
      <Image
        source={require("@/assets/images/header-default-background.png")}
        className="absolute w-full h-3/4 left-0 right-0"
        resizeMode="cover"
        alt="image"
      />
      <SafeAreaView className="relative flex flex-1 w-full pt-8">
        <VStack className="flex-1 mt-5">
          <Text className="text-white text-2xl font-bold py-4 px-4">
            {bookingData?.name}
          </Text>
          <ScrollView
            className="relative flex flex-1 h-full "
            stickyHeaderIndices={[1, 3]}
            snapToInterval={200}
            snapToAlignment="start"
          >
            <Box>
              <VStack className="gap-4">
                {/* Contact Card */}
                <AccountManagerContact
                  manager={bookingData?.contact as Contact}
                />
                <Box className="border-t border-white mx-4" />

                {/* Booking Details */}
                <VStack className="gap-2 px-4">
                  <HStack className="gap-4 flex items-center">
                    <Text className="text-l font-bold text-white/90 text-base">
                      {/* Format as USD currency */}
                      {formatCurrency(bookingData?.total_grand_total)}
                    </Text>
                    {/** // TODO: Make this dynamic based on the status */}
                    <Text className="text-2xs text-green-900 bg-green-100 px-2 py-1 rounded-sm text-center">
                      {bookingData?.status?.toUpperCase()}
                    </Text>
                  </HStack>
                  <View className="flex-row items-center">
                    <Icon
                      as={Calendar1}
                      className="w-5 h-5 text-primary-500 mr-2"
                    />
                    <Text className="text-sm font-medium text-white">
                      {formatFullDate(bookingData?.start_date || "")} -{" "}
                      {formatFullDate(bookingData?.end_date || "")}
                    </Text>
                  </View>
                  <View className="flex-row items-center py-1">
                    <Icon
                      as={MapPin}
                      className="w-5 h-5 text-primary-500 mr-2"
                    />
                    <Text className="text-sm font-medium text-white">
                      {findBookingAddress(bookingData?.custom_fields || [])}
                    </Text>
                  </View>
                  <VStack className="mt-10 mb-5 gap-2">
                    <HStack className="gap-2 justify-center items-center">
                      <Text className="text-center color-white font-semibold">
                        CONFIRM MENU HERE
                      </Text>
                      <Icon as={ChevronDown} className="w-5 h-5 text-white" />
                    </HStack>
                    <Button
                      disabled={beo === null}
                      className="rounded-full"
                      onPress={() => {
                        if (beo) {
                          Linking.openURL(beo.url);
                        }
                      }}
                    >
                      <HStack>
                        <Icon
                          as={NotepadText}
                          className="w-5 h-5 text-white mr-2"
                        />
                        <ButtonText className=" text-white">
                          Banquet Event Order
                        </ButtonText>
                      </HStack>
                    </Button>
                  </VStack>
                </VStack>
              </VStack>
            </Box>
            <VStack className="bg-white py-2 gap-1">
              {/* Events scrollable calendar */}
              <Text className="text-xl font-bold px-4">Events</Text>
              {/* Events calendar scrollview */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <HStack className="gap-4 px-4">
                  {[
                    { day: "Tue", date: "03", selected: true },
                    { day: "Wed", date: "04", selected: false },
                    { day: "Thu", date: "05", selected: false },
                    { day: "Fri", date: "06", selected: false },
                    { day: "Sat", date: "07", selected: false },
                    { day: "Sun", date: "08", selected: false },
                    { day: "Mon", date: "09", selected: false },
                    { day: "Tue", date: "10", selected: false },
                    { day: "Wed", date: "11", selected: false },
                    { day: "Thu", date: "12", selected: false },
                    { day: "Fri", date: "13", selected: false },
                    { day: "Sat", date: "14", selected: false },
                    { day: "Sun", date: "15", selected: false },
                    { day: "Mon", date: "16", selected: false },
                  ].map((item, index) => (
                    <Button
                      variant="link"
                      key={index}
                      className={`flex-col items-center justify-center rounded-xl h-14 w-12 ${
                        item.selected
                          ? "bg-primary-500 transform -skew-x-12"
                          : "bg-transparent"
                      }`}
                    >
                      <VStack className="gap-0">
                        <Text
                          className={`text-center text-xs font-bold ${
                            item.selected
                              ? "text-white skew-x-12"
                              : "text-gray-800"
                          }`}
                        >
                          {item.day}
                        </Text>
                        <Text
                          className={`text-center text-xs font-bold ${
                            item.selected
                              ? "text-white skew-x-12"
                              : "text-gray-800"
                          }`}
                        >
                          {item.date}
                        </Text>
                      </VStack>
                    </Button>
                  ))}
                </HStack>
              </ScrollView>
            </VStack>
            <VStack className="bg-gray-100 px-4 py-4 gap-4">
              {Array.from({ length: 5 }).map((_, eventId) => (
                <Box
                  key={eventId}
                  className="bg-white p-4  shadow-slate-100 rounded-[8px]"
                >
                  <HStack className="justify-between items-start mb-3">
                    <VStack className="flex-1">
                      <HStack className="justify-between items-center">
                        <Text className="text-sm text-gray-600 mb-1">
                          7:00 AM - 8:00 AM
                        </Text>
                        <HStack className="gap-1">
                          <Icon
                            as={UsersRound}
                            className="w-5 h-5 text-primary-500"
                          />
                          <Text className="text-sm text-gray-700">100</Text>
                        </HStack>
                      </HStack>
                      <Text className="text-xl font-bold text-gray-900 flex-1">
                        ROCKFORD PCHS BREAKFAST
                      </Text>
                      <HStack className="flex flex-1 items-center justify-between">
                        <Text className="text-base text-gray-700 mt-1">
                          $3,278.88
                        </Text>
                        <Box className="bg-green-100 px-2 py-1 rounded">
                          <Text className="text-green-800 text-xs font-bold">
                            DEFINITE
                          </Text>
                        </Box>
                      </HStack>
                    </VStack>
                  </HStack>

                  <HStack className="justify-end gap-3 mt-4">
                    <Button
                      variant="outline"
                      className="border-primary-500 bg-white px-4 py-2 rounded-full"
                    >
                      <HStack className="items-center gap-2">
                        <Icon
                          as={NotepadText}
                          fill="#f97316"
                          className="w-4 h-4 text-primary-500"
                        />
                        <ButtonText className="text-primary-500 font-medium">
                          BEO
                        </ButtonText>
                      </HStack>
                    </Button>
                    <Button
                      className="bg-primary-500 px-4 py-2 rounded-full"
                      onPress={() => router.push(`/event-details/${eventId}`)}
                    >
                      <ButtonText className="text-white font-medium">
                        View Details
                      </ButtonText>
                    </Button>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </ScrollView>
        </VStack>
      </SafeAreaView>
    </>
  );
}
