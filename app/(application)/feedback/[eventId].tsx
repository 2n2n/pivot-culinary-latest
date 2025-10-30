import FeedbackStarRatingSection from "@/components/FeedbackStarRatingSection";
import LoadingIndicator from "@/services/theme_loader_screen/components/LoadingIndicator";
import ReviewSubmittedIndicator from "@/components/ReviewSubmittedIndicator";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import EventDetails from "@/components/EventDetails/EventDetails";
import { PilledButton } from "@/components/styled/PilledButton";
import ConfettiCanon from "@/components/ConfettiCanon";
import SwipeUpView from "@/components/SwipeUpView";
import { Center } from "@/components/ui/center";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";

import { router, Stack, useLocalSearchParams } from "expo-router";
import { ImagePlus, NotepadText, X } from "lucide-react-native";
import { FlatList, View } from "react-native";
import { useState } from "react";

type ImageUploadItem = Array<{
  id: string;
  uri: string;
  metadata: Record<string, any>;
  progress?: number;
  complete?: boolean;
}>;

function Feedback() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const [imageUploads, setImageUploads] = useState<ImageUploadItem>([
    {
      id: "1",
      uri: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      progress: 70,
      metadata: {},
    },
    {
      id: "2",
      uri: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      complete: true,
      metadata: {},
    },
    {
      id: "3",
      uri: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      complete: true,
      metadata: {},
    },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [categoryRatings, setCategoryRatings] = useState<
    Record<string, number>
  >({
    taste: 0,
    timeliness: 0,
    service: 0,
    presentation: 0,
  });
  const [comment, setComment] = useState("");
  // TODO: canSubmit - should require all star ratings, and comment to be set to true.
  const canSubmit = Object.values(categoryRatings).every(
    (rating) => rating > 0
  );
  const SHOW_FINANCE = true;
  const SHOW_BEO = true;
  const EVENT_DATA: BookingEvent = {
    id: eventId,
    name: "General Santos Champions League",
    amount: "$39,278.88",
    status: "DEFINITE",
    guests: 200,
    startTime: "7:00 AM",
    endTime: "10:00 AM",
    startDate: new Date(),
    endDate: new Date(),
    address: "10710 W Camelback Rd, Phoenix, AZ 85037, USA",
    beoUrl: "https://www.google.com",
    managerAccount: {
      name: "Cali Everitt",
      role: "Account Manager",
      phone: "123-456-7890",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
  };
  const handleSubmission = () => {
    if (submitting || submitted) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 5000);
    setTimeout(() => router.replace("/(application)/(tabs)/bookings"), 20000);
  };
  return (
    <View className="relative placeholder:flex-1 bg-pivot-blue">
      <Stack.Screen
        options={{
          headerTitle: EVENT_DATA.name,
          headerBackTitle: "Event Details",
          headerShown: !submitting && !submitted,
        }}
      />
      {/* // TODO: Fix issue with flickering screen when Stack Navigation header is collapsed  */}
      <Center className="absolute inset-0">
        {submitting && <LoadingIndicator />}
        {submitted && (
          <>
            <ConfettiCanon origin="bottom-right" />
            <ConfettiCanon origin="bottom-left" />
            <ReviewSubmittedIndicator />
          </>
        )}
      </Center>
      <SwipeUpView
        enabled={canSubmit}
        onRelease={handleSubmission}
        style={{ flex: 1, gap: 12, backgroundColor: "#FFFFFF" }}
      >
        <EventDetails
          showFinance={SHOW_FINANCE}
          showBeo={SHOW_BEO}
          event={EVENT_DATA}
        >
          <HStack className="justify-between">
            <EventDetails.TimeRange />
            <EventDetails.GuestCount />
          </HStack>
          <EventDetails.Financial />
          <EventDetails.Date />
          <EventDetails.Address />
          <PilledButton>
            <ButtonIcon as={NotepadText} />
            <ButtonText className="text-sm">Banquet Event Order</ButtonText>
          </PilledButton>
          <EventDetails.ManagerAccount className="pt-2" />
        </EventDetails>
        <VStack className="px-4 gap-3 flex-1">
          {/* //! NOTE: reanimated shared value resets when the dev app is hot-reloaded, make sure to include the rating prop */}
          <FeedbackStarRatingSection
            categoryRatings={categoryRatings}
            onChangeRating={setCategoryRatings}
          />
          <Text className="font-bold mt-1">
            Share more about your experience
          </Text>
          <Textarea size="sm" className="h-[60px]">
            <TextareaInput value={comment} onChangeText={setComment} />
          </Textarea>
          <Button size="lg" variant="outline" className="rounded-full">
            <ButtonIcon as={ImagePlus} />
            <ButtonText>Add Photos</ButtonText>
          </Button>
          <FlatList
            data={imageUploads}
            horizontal
            showsHorizontalScrollIndicator={false}
            // * NOTE: THERE MIGHT BE A BETTER WAY OF DISPLAYING UPLOADED PHOTOS
            renderItem={({ item }) => (
              <Box
                key={item.id}
                className="relative rounded-lg overflow-hidden bg-gray-400"
              >
                <Image
                  source={{ uri: item.uri }}
                  alt="Uploaded Image"
                  className="h-full min-w-[120px] aspect-auto"
                />
                {item.complete && (
                  <Button
                    size="sm"
                    className="rounded-full px-2 py-1 bg-black/60 absolute top-1 left-1"
                  >
                    <ButtonIcon as={X} className="text-white" />
                  </Button>
                )}
                {item.progress && !item.complete && (
                  <Center className="flex-1 absolute inset-0 px-4 bg-black/60">
                    <Progress value={item.progress}>
                      <ProgressFilledTrack />
                    </Progress>
                  </Center>
                )}
              </Box>
            )}
            contentContainerClassName="gap-2"
            className="min-h-[120px] rounded-lg overflow-hidden"
          />
        </VStack>
      </SwipeUpView>
    </View>
  );
}

export default Feedback;
