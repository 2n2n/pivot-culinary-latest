import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Image } from "@/components/ui/image";
import { Box } from "@/components/ui/box";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

import { View, Text, ScrollView, Alert } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Calendar1,
  ChevronDown,
  MapPin,
  MessageSquareMore,
  NotepadText,
  Phone,
  Search,
  UsersRound,
} from "lucide-react-native";
import { Icon } from "@/components/ui/icon";

// REVIEW: Screen should be polished.
export default function BookingDetails() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerBackTitle: "Booking Details",
          headerRight: () => (
            <HStack className="gap-2">
              <Button
                variant="link"
                onPress={() => Alert.alert("testing")}
                className="w-10 h-10 rounded-full p-0 items-center justify-center"
              >
                <Icon as={Search} className="color-white" />
              </Button>
              {
                // TODO: Make profile image dynamic based on the active account.
              }
              <Button
                variant="link"
                onPress={() => {
                  console.log("clicked me");
                }}
              >
                <Avatar className="bg-white rounded-full">
                  <AvatarImage
                    alt="Chicago bulls"
                    source={{
                      uri: "data:image/png;base64,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",
                    }}
                  />
                </Avatar>
              </Button>
            </HStack>
          ),
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
            ROCKFORD PCHS Q4 - WK 1
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
                <HStack className="items-center justify-between py-1 px-4">
                  <HStack className="items-center gap-3 flex-1">
                    <Avatar size="lg">
                      <AvatarImage
                        source={{
                          uri: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
                        }}
                        alt="Account Manager"
                      />
                      {/* <AvatarFallbackText>CE</AvatarFallbackText> */}
                    </Avatar>
                    <VStack className="flex-1">
                      <Text className="text-white text-lg font-semibold">
                        Cali Everitt
                      </Text>
                      <Text className="text-white/80 text-sm">
                        Account Manager
                      </Text>
                    </VStack>
                  </HStack>

                  <HStack className="gap-4">
                    <Button
                      size="sm"
                      className="w-12 h-12 rounded-full bg-background-transparent border border-white"
                    >
                      <Icon className="text-white" as={Phone} />
                    </Button>
                    <Button
                      size="sm"
                      className="w-12 h-12 rounded-full bg-background-transparent border border-white"
                    >
                      <Icon className="text-white" as={MessageSquareMore} />
                    </Button>
                  </HStack>
                </HStack>
                <Box className="border-t border-white mx-4" />

                {/* Booking Details */}
                <VStack className="gap-2 px-4">
                  <HStack className="gap-4 flex items-center">
                    <Text className="text-l font-bold text-white/90 text-base">
                      $39,278.88
                    </Text>
                    <Text className="text-2xs text-green-900 bg-green-100 px-2 py-1 rounded-sm text-center">
                      DEFINITE
                    </Text>
                  </HStack>
                  <View className="flex-row items-center">
                    <Icon
                      as={Calendar1}
                      className="w-5 h-5 text-orange-500 mr-2"
                    />
                    <Text className="text-sm font-medium text-white">
                      Mon, Oct 3, 2023 – Sun, Oct 9, 2023
                    </Text>
                  </View>
                  <View className="flex-row items-center py-1">
                    <Icon
                      as={MapPin}
                      className="w-5 h-5 text-orange-500 mr-2"
                    />
                    <Text className="text-sm font-medium text-white">
                      10710 W Camelback Rd, Phoenix, AZ 85037, USA
                    </Text>
                  </View>
                  <VStack className="mt-10 mb-5 gap-2">
                    <HStack className="gap-2 justify-center items-center">
                      <Text className="text-center color-white font-semibold">
                        CONFIRM MENU HERE
                      </Text>
                      <Icon as={ChevronDown} className="w-5 h-5 text-white" />
                    </HStack>
                    <Button className="bg-orange-500 rounded-full">
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
                          ? "bg-orange-500 transform -skew-x-12"
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
                            className="w-5 h-5 text-orange-500"
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
                      className="border-orange-500 bg-white px-4 py-2 rounded-full"
                    >
                      <HStack className="items-center gap-2">
                        <Icon
                          as={NotepadText}
                          fill="#f97316"
                          className="w-4 h-4 text-orange-500"
                        />
                        <ButtonText className="text-orange-500 font-medium">
                          BEO
                        </ButtonText>
                      </HStack>
                    </Button>
                    <Button
                      className="bg-orange-500 px-4 py-2 rounded-full"
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
