
import type { BookingEvent } from "@/types/event";

import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import EventDetails from "@/components/EventDetails/EventDetails";
import SwipeUpView from "@/components/SwipeUpView";
import StarRating from "@/components/StarRating";
import { Center } from "@/components/ui/center";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";

import { router, Stack, useLocalSearchParams } from "expo-router";
import { ImagePlus, X } from "lucide-react-native";
import { FlatList, View } from "react-native";
import { useEffect, useState } from "react";
import { Box } from "@/components/ui/box";


type ImageUploadItem = Array<{
  id: string,
  uri: string, 
  metadata: Record<string, any>,
  progress?: number,
  complete?: boolean,
}>

function Feedback() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const [imageUploads, setImageUploads] = useState<ImageUploadItem>([
    {
      id: "1",
      uri: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      progress: 70,
      metadata: {}
    },
    {
      id: "2",
      uri: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      complete: true,
      metadata: {}
    },
    {
      id: "3",
      uri: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      complete: true,
      metadata: {}
    }
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [tasteRating, setTasteRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [timelinessRating, setTimelinessRating] = useState(0);
  const [presentationRating, setPresentationRating] = useState(0);
  const [comment, setComment] = useState("");
  // TODO: canSubmit - should require all star ratings, and comment to be set to true.
  const canSubmit = presentationRating > 0;
  const overallRating = ( tasteRating + timelinessRating + serviceRating + presentationRating ) / 4;
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
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    }
  }
  const handleSubmission = () => {
    if (submitting || submitted) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        router.replace("/(application)/(tabs)/bookings");
      }, 2000);
    }, 5000);
  }
  useEffect(() => {
    
  }, [submitting, submitted]);
  return <View className="relative placeholder:flex-1 bg-pivot-blue">
    <Stack.Screen
      options={{
        headerTitle: EVENT_DATA.name,
        headerBackTitle: "Event Details",
        headerShown: !submitting && !submitted,
      }}
    />
    <Center className="absolute inset-0">
      {/* // TODO: Pivot/Gameday logo animation and submission success animation including confetti..  */}
      {/* //TODO: Fix snapping issues due to Stack navigation header showing dynamically */}
      {submitting && <Text className="text-white">Submitting...</Text>}
      {submitted && <Text className="text-white">!!!! SUBMITTED !!!!</Text>}
    </Center>
    <SwipeUpView enabled={canSubmit} onRelease={handleSubmission} style={{ flex: 1, gap: 12, backgroundColor: "#FFFFFF" }}>
      <EventDetails showFinance={SHOW_FINANCE} showBeo={SHOW_BEO} event={EVENT_DATA}>
        <HStack className="justify-between">
          <EventDetails.TimeRange />
          <EventDetails.GuestCount />
        </HStack>
        <EventDetails.Financial />
        <EventDetails.Date />
        <EventDetails.Address />
        <EventDetails.BEO />
        <EventDetails.ManagerAccount className="pt-2"/>
      </EventDetails>
      <VStack className="px-4 gap-3 flex-1">
        {/* //* REVIEW STAR RATINGS */}
        {/* //! NOTE: reanimated shared value resets when the dev app is hot-reloaded, make sure to include the rating prop */}
        <StarRating disabled={true} size={45} rating={overallRating} style={{ alignSelf: "center" }} />
        <HStack className="items-center justify-between">
          <Text className="font-bold">Taste</Text>
          <StarRating rating={tasteRating} onChange={setTasteRating} />
        </HStack>
        <HStack className="items-center justify-between">
          <Text className="font-bold">Timeliness</Text>
          <StarRating rating={timelinessRating} onChange={setTimelinessRating} />
        </HStack>
        <HStack className="items-center justify-between">
          <Text className="font-bold">Service</Text>
          <StarRating rating={serviceRating} onChange={setServiceRating} />
        </HStack>
        <HStack className="items-center justify-between">
          <Text className="font-bold">Presentation</Text>
          <StarRating rating={presentationRating} onChange={setPresentationRating} />
        </HStack>
        {/* //* REVIEW STAR RATINGS */}
        <Text className="font-bold mt-1">Share more about your experience</Text>
        <Textarea size="sm" className="h-[60px]" >
          <TextareaInput value={comment} onChangeText={setComment} />
        </Textarea>
        {/* // TODO: Pivot gameday blue */}
        {/* // TODO: Implement expo-image-picker with upload progress indicator */}
        <Button size="lg" variant="outline" className="rounded-full">
          <ButtonIcon as={ImagePlus} />
          <ButtonText>Add Photos</ButtonText>
        </Button>
        <FlatList
          data={imageUploads}
          horizontal
          showsHorizontalScrollIndicator={false}
          // TODO: uploaded image item to a component
          // TODO: fix type issues with ListRenderItemInfo item property
          // * NOTE: THERE MIGHT BE A BETTER WAY OF DISPLAYING UPLOADED PHOTOS 
          renderItem={({ item }) => (<Box key={item.id} className="relative rounded-lg overflow-hidden bg-gray-400">
            <Image source={{ uri: item.uri }} alt="Uploaded Image" className="h-full min-w-[120px] aspect-auto" />
            {/* REMOVE UPLOADED IMAGE X BUTTON */}
            {item.complete && <Button size="sm" className="rounded-full px-2 py-1 bg-black/60 absolute top-1 left-1">
              <ButtonIcon as={X} className="text-white"/>
            </Button>}
            {/* REMOVE UPLOADED IMAGE X BUTTON */}
            {/* PENDING UPLOAD PROGRESS INDICATOR */}
            {item.progress && !item.complete && <Center className="flex-1 absolute inset-0 px-4 bg-black/60">
              <Progress value={item.progress}>
                <ProgressFilledTrack className="bg-pivot" />
              </Progress>
            </Center>}
            {/* PENDING UPLOAD PROGRESS INDICATOR */}
          </Box>)}
          contentContainerClassName="gap-2"
          className="flex-1 rounded-lg overflow-hidden"
        />
      </VStack>
    </SwipeUpView>
  </View>;
}

export default Feedback;
