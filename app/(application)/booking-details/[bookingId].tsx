import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Image } from "@/components/ui/image";
import { Box } from "@/components/ui/box";

import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";

// TODO: use ScrollView stickyHeaderIndices https://reactnative.dev/docs/scrollview#stickyheaderindices
export default function BookingDetails() {
  const router = useRouter();
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();

  return (
    <>
      <VStack className="flex-1 w-full">
        <Image
          source={require("@/assets/images/header-default-background.png")}
          className="absolute w-full h-1/2 left-0 right-0"
          resizeMode="cover"
          alt="image"
        />
        <Text className="text-white text-3xl w-full py-4 pl-4">
          General Santos Champions League
        </Text>
        <ScrollView
          className="relative flex flex-1 h-full "
          stickyHeaderIndices={[1, 3]}
          snapToInterval={200}
          snapToAlignment="start"
        >
          <Box className="p-4">
            <Text className="text-white text-2xl">
              Booking Id: {bookingId}
              {`\n`}Account Manager Details{`\n`}Cost{`\n\n`}Address{`\n`}Start
              - End Date
            </Text>
          </Box>
          <VStack className="bg-white px-2 py-4 gap-2">
            <Text className="text-lg">Events</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <HStack className="gap-2">
                {Array.from({ length: 30 }).map((_, index) => (
                  <Button
                    size="lg"
                    key={index}
                    className="bg-orange-400 rounded-md"
                  >
                    <ButtonText className="text-white">{index + 1}</ButtonText>
                  </Button>
                ))}
              </HStack>
            </ScrollView>
          </VStack>
          <VStack className="bg-gray-300 px-4 py-4 gap-4">
            {Array.from({ length: 30 }).map((_, eventId) => (
              <View
                key={eventId}
                style={{
                  flex: 1,
                  padding: 20,
                  backgroundColor: "#fff",
                  borderRadius: 12,
                }}
              >
                <Text style={{ fontSize: 16, color: "#666" }}>
                  Event ID: {eventId}
                </Text>
                <Text style={{ fontSize: 16, marginTop: 20, lineHeight: 24 }}>
                  This is the booking details screen. You can access it via the
                  path: event/details/{eventId}
                </Text>
                <Button onPress={() => router.back()}>
                  <ButtonText>Go Back</ButtonText>
                </Button>
              </View>
            ))}
          </VStack>
        </ScrollView>
      </VStack>
    </>
  );
}
