import { findBookingAddress, formatCurrency, formatFullDate, getBEO } from "@/helpers";
import AccountManagerContact from "@/components/AccountManagerContact";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Image } from "@/components/ui/image";
import { Icon } from "@/components/ui/icon";
import { Box } from "@/components/ui/box";

import { Calendar1, ChevronDown, Inbox, MapPin, NotepadText, UsersRound } from "lucide-react-native";
import { View, Text, ScrollView, Linking, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import useBookingEvents from "@/hooks/useBookingEvents";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Center } from "@/components/ui/center";

// REVIEW: Screen should be polished.
export default function BookingDetails() {
  const router = useRouter();
  //! TODO: A critical navigation bug involving 'item' param will definitely happen here,
  //! see https://github.com/expo/expo/issues/26664
  const { item, bookingId } = useLocalSearchParams<{
    bookingId: string;
    item: string;
  }>();
  

  const bookingData = useMemo(() => {
    return JSON.parse(item as string);
  }, [item]);

  const beo = useMemo(() => {
    if (bookingData && bookingData.documents) return getBEO(bookingData.documents) || null;
    else return null;
  }, [bookingData]);
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
                <AccountManagerContact manager={bookingData?.contact as Contact} />
                <Box className="border-t border-white mx-4" />

                {/* Booking Details */}
                <VStack className="gap-2 px-4">
                  <HStack className="gap-4 flex items-center">
                    <Text className="text-l font-bold text-white text-base">
                      {/* Format as USD currency */}
                      {formatCurrency(bookingData?.total_grand_total)}
                    </Text>
                    {/** // TODO: Make this dynamic based on the status */}
                    <Text className="text-2xs text-green-900 bg-green-100 px-2 py-1 rounded-sm text-center">
                      {bookingData?.status?.toUpperCase()}
                    </Text>
                  </HStack>
                  <View className="flex-row items-center">
                    <Icon as={Calendar1} className="w-5 h-5 text-primary-500 mr-2" />
                    <Text className="text-sm font-medium text-white">
                      {formatFullDate(bookingData?.start_date || "")} -{" "}
                      {formatFullDate(bookingData?.end_date || "")}
                    </Text>
                  </View>
                  <View className="flex-row items-center py-1">
                    <Icon as={MapPin} className="w-5 h-5 text-primary-500 mr-2" />
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
                        if (beo) Linking.openURL(beo.url)
                      }}
                    >
                      <HStack>
                        <Icon as={NotepadText} className="w-5 h-5 text-white mr-2" />
                        <ButtonText className=" text-white">
                          Banquet Event Order
                        </ButtonText>
                      </HStack>
                    </Button>
                  </VStack>
                </VStack>
              </VStack>
            </Box>
            <BookingEvents bookingId={bookingId} />
          </ScrollView>
        </VStack>
      </SafeAreaView>
    </>
  );
}

// TODO: Break down component for reuse
export const BookingEventCard = ({ event }: { event: TripleseatEvent }) => {
  const beo = useMemo(() => getBEO(event.documents || []), [event]);
  return <Box key={event.id} className="bg-white p-4 rounded-[8px]">
    <HStack className="justify-between items-start mb-3">
      <VStack className="flex-1">
        <HStack className="justify-between items-center">
          <Text className="text-sm text-gray-600 mb-1">
            {event.event_start_time} - {event.event_end_time}
          </Text>
          <HStack className="gap-1">
            <Icon as={UsersRound} className="w-5 h-5 text-primary-500" />
            <Text className="text-sm text-gray-700">
              {event.guest_count}
            </Text>
          </HStack>
        </HStack>
        <Text className="text-xl font-bold text-gray-900 flex-1">
          {event.name}
        </Text>
        <HStack className="flex flex-1 items-center justify-between">
          <Text className="text-base text-gray-700">
            {formatCurrency(event.total_event_grand_total)}
          </Text>
          <Box className="bg-green-100 px-2 py-1 rounded">
            <Text className="text-green-800 text-xs font-bold">
              {event.status.toUpperCase()}
            </Text>
          </Box>
        </HStack>
      </VStack>
    </HStack>
    <HStack className="justify-end gap-3 mt-4">
      <Button disabled={!beo}  variant="outline" className={`px-4 py-2 rounded-full ${!beo ? "border-gray-600" : "border-primary-500"}`}>
        <Icon as={NotepadText} className={`w-4 h-4 ${!beo ? "text-gray-600" : "text-primary-500"}`}/>
        <ButtonText className={`font-bold ${!beo ? "text-gray-600" : "text-primary-500"}`} onPress={() => {
          if (beo) Linking.openURL(beo?.url || "");
        }}>
          BEO
        </ButtonText>
      </Button>
      <Link href={`/(application)/event-details/${event.id}`} asChild>
        <Button className="bg-primary-500 px-4 py-2 rounded-full">
          <ButtonText className="text-white font-bold">
            View Details
          </ButtonText>
        </Button>
      </Link>
    </HStack>
  </Box>
};

// TODO: Complete breaking down of Booking details
const BookingEvents = ({ bookingId }: { bookingId: string }) => {
  const bookingEventsQuery = useBookingEvents(bookingId);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  // NOTE: tried to memo two state at a single computation, saves time and rerenders
  const { orderedDates, groupedBookingEvents } = useMemo(() => {
    const dateSet = new Set<string>();
    // NOTE: Ordered dates assumes that the booking events are already sorted by start_date
    // See useBookingEvents hook 
    const updatedOrderedDates: Array<string> = [];
    const updatedGroupedBookingEvents: Record<string, Array<TripleseatEvent>> = {};
    
    if (!bookingEventsQuery.data?.length) return { 
      orderedDates: updatedOrderedDates, 
      groupedBookingEvents: updatedGroupedBookingEvents 
    };
    for (let index = 0; index < bookingEventsQuery.data?.length; index++) {
      const event = bookingEventsQuery.data[index];
      // NOTE: Set.has is a quick lookup to check is already in the array
      // without iterating through the array
      const eventDateIsUnstored = !dateSet.has(event.start_date);
      if (eventDateIsUnstored) {
        dateSet.add(event.start_date);
        updatedOrderedDates.push(event.start_date);
        updatedGroupedBookingEvents[event.start_date] = [];
      }
      updatedGroupedBookingEvents[event.start_date].push(event);
    }
    return { 
      orderedDates: updatedOrderedDates, 
      groupedBookingEvents: updatedGroupedBookingEvents
    };
  }, [bookingEventsQuery.data]);
  const selectedEvents = useMemo(() => {
    if (!selectedDate) {
      if (orderedDates[0]) return groupedBookingEvents[orderedDates[0]] || [];
      else return [];
    } else return groupedBookingEvents[selectedDate] || [];
  }, [selectedDate, orderedDates, groupedBookingEvents]);
  if (bookingEventsQuery.isLoading) return <BookingEventsSkeleton />;
  else if (bookingEventsQuery.data?.length === 0) return <EmptyBookingEvents />;
  return <>
    <VStack className="bg-white py-2 gap-1">
      <Text className="text-xl font-bold px-4">Events</Text>
      <DateSelectionTabs dates={orderedDates} activeDate={selectedDate} onChangeDate={setSelectedDate} />
    </VStack>
    <VStack className="bg-gray-100 px-4 py-4 gap-4">
      {selectedEvents.map(event => <BookingEventCard event={event} key={event.id} />)}
    </VStack>
  </>;
};

const DateSelectionTabs = ({ dates, activeDate, onChangeDate }: { dates: string[], activeDate: string | null, onChangeDate: (date: string) => void }) => {
  return <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    <HStack className="gap-4 px-4">
      {dates.map((item, index) => (
        <Button 
          key={item} 
          variant={item === activeDate || (index === 0 && !activeDate) ? "solid" : "link"} 
          onPress={() => onChangeDate(item)}
          className="items-center justify-center h-14 w-12 px-0 -skew-x-6"
        >
          <VStack className="items-center justify-center">
            <ButtonText className="text-xs font-bold">{format(new Date(item), "EEE")}</ButtonText>
            <ButtonText className="text-xs font-bold">{format(new Date(item), "dd")}</ButtonText>
          </VStack>
        </Button>
      ))}
    </HStack>
  </ScrollView>;
};

const BookingEventsSkeleton = () => <>
  <VStack className="bg-white py-2 gap-2">
    <Skeleton className="h-[20px] w-[80px] rounded-md ml-4"></Skeleton>
    <HStack className="gap-4 overflow-hidden pl-4">
      <Skeleton className="h-14 w-12 px-0 -skew-x-6 rounded-md"></Skeleton>
      <Skeleton className="h-14 w-12 px-0 -skew-x-6 rounded-md"></Skeleton>
      <Skeleton className="h-14 w-12 px-0 -skew-x-6 rounded-md"></Skeleton>
      <Skeleton className="h-14 w-12 px-0 -skew-x-6 rounded-md"></Skeleton>
      <Skeleton className="h-14 w-12 px-0 -skew-x-6 rounded-md"></Skeleton>
      <Skeleton className="h-14 w-12 px-0 -skew-x-6 rounded-md"></Skeleton>
      <Skeleton className="h-14 w-12 px-0 -skew-x-6 rounded-md"></Skeleton>
      <Skeleton className="h-14 w-12 px-0 -skew-x-6 rounded-md"></Skeleton>
      <Skeleton className="h-14 w-12 px-0 -skew-x-6 rounded-md"></Skeleton>
    </HStack>
  </VStack>
  <VStack className="bg-gray-100 px-4 py-4 gap-4">
    <Skeleton className="h-[100px] w-full rounded-lg"></Skeleton>
    <Skeleton className="h-[100px] w-full rounded-lg"></Skeleton>
    <Skeleton className="h-[100px] w-full rounded-lg"></Skeleton>
  </VStack>
</>;

const EmptyBookingEvents = () => <VStack className="bg-white py-2 gap-1 h-[400px]">
  <Text className="text-xl font-bold px-4">Events</Text>
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
            No events yet!
          </Text>
          <Text className="text-base text-gray-400 text-center max-w-[80%]">
            This particular booking has currently no Events
          </Text>
        </VStack>
      </VStack>
</VStack>