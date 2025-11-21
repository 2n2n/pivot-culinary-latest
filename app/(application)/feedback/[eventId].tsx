import { findBookingAddress, formatCurrency, formatFullDate, getBEO, getStorageFilePath } from "@/helpers";
import LoadingIndicator from "@/services/theme_loader_screen/components/LoadingIndicator";
import { submitFeedback, submitRealtimeFeedback } from "@/requests/feedback.request";
import FeedbackStarRatingSection from "@/components/FeedbackStarRatingSection";
import ReviewSubmittedIndicator from "@/components/ReviewSubmittedIndicator";
import AddPhotoButton, { ImageAsset } from "@/components/AddPhotoButton";
import AccountManagerContact from "@/components/AccountManagerContact";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { ButtonIcon, ButtonText } from "@/components/ui/button";
import { PilledButton } from "@/components/styled/PilledButton";
import useTripleseatEvent from "@/hooks/useTripleseatEvent";
import { Badge, BadgeText } from "@/components/ui/badge";
import ConfettiCanon from "@/components/ConfettiCanon";
import FeedbackImage from "@/components/FeedbackImage";
import { ImageItem } from "@/hooks/useImageUpload";
import SwipeUpView from "@/components/SwipeUpView";
import { HStack } from "@/components/ui/hstack";
import { Center } from "@/components/ui/center";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";

import { CalendarDays, CircleAlert, MapPin, NotepadText, UsersRound } from "lucide-react-native";
import { getCrashlytics } from "@react-native-firebase/crashlytics";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useMemo, useReducer, useState } from "react";
import { FlatList, View } from "react-native";
import * as Linking from "expo-linking";

export default function Feedback() {
  // TODO: The backend should really be the one to handle if the feedback is realtime or post-event
  // TODO: Or we create PostFeedbackButton component with checks if the event is today or in the past or if the event came from notification
  const { eventId, feedbackType = "realtime" } = useLocalSearchParams<{ eventId: string, feedbackType: "realtime" | "post-event" }>();
  const { data: event, isPending } = useTripleseatEvent(eventId);
  const [feedbackImages, dispatchFeedbackImages] = useReducer(feedbackImageReducer, []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [criteria, setCriteria] = useState<Record<string, number>>({ taste: 0, timeliness: 0, service: 0, presentation: 0 });
  const [comment, setComment] = useState("");
  const canSubmit = useMemo(() => {
    const allRatingsFilled = Object.values(criteria).every((rating) => rating > 0);
    const allImagesUploaded = feedbackImages.some((feedbackImage) => feedbackImage.uploaded);
    return allRatingsFilled && allImagesUploaded;
  }, [criteria, feedbackImages]);
  const handleSubmission = async () => {
    try {
      if (isSubmitting || isSubmitted || !event) return;
      setIsSubmitting(true);
      const attachments = feedbackImages.filter(feedbackImage => feedbackImage.uploaded)
        .map(feedbackImage => feedbackImage.storagePath);
      const feedback = {
        eventId: eventId,
        feedback: {
          criteria,
          comment,
          attachments,
        },
      };
      if (feedbackType === "realtime") await submitRealtimeFeedback(feedback);
      else await submitFeedback(feedback);
      setTimeout(() => router.replace("/(application)/(tabs)/bookings"), 6000);
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : "Feedback submission failed, please try again");
      getCrashlytics().recordError(error as Error);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };
  if (isPending) return <View className="flex-1 justify-center items-center">
    <Stack.Screen options={{
      headerTitle: "Post Feedback",
      headerBackTitle: "Event Details",
    }}/>
  </View>
  else if (!event) return <View className="flex-1 justify-center items-center">
    <Stack.Screen options={{
      headerTitle: "Post Feedback",
      headerBackTitle: "Event Details",
    }}/>
    <></>
  </View>
  return <View className="relative placeholder:flex-1 bg-pivot-blue">
    <Stack.Screen options={{
      headerTitle: event.name,
      headerBackTitle: "Event Details",
      headerShown: !isSubmitting && !isSubmitted,
    }}/>
    {/* // TODO: Fix issue with flickering screen when Stack Navigation header is collapsed  */}
    <Center className="absolute inset-0">
      {isSubmitting && <LoadingIndicator />}
      {isSubmitted && <>
        <ConfettiCanon origin="bottom-right" />
        <ConfettiCanon origin="bottom-left" />
        <ReviewSubmittedIndicator />
      </>}
      {submissionError && <>
        <CircleAlert className="text-error-500" size={48} />
        <Text className="text-error-500 text-center">
          {submissionError}
        </Text>
      </>}
    </Center>
    <SwipeUpView
      enabled={canSubmit}
      onRelease={handleSubmission}
      style={{ flex: 1, gap: 12, backgroundColor: "#FFFFFF" }}
    >
      <VStack className="gap-2 px-4">
        <HStack className="justify-between">
          <HStack className="gap-2 items-center">
              <Icon as={CalendarDays} className="text-primary-500" />
              <Text>{event.event_start_time} - {event.event_end_time}</Text>
          </HStack>
          <HStack className="gap-2 items-center">
            <Icon as={UsersRound} className="text-primary-500" />
            <Text className="text-sm font-semibold">{event.guest_count}</Text>
          </HStack>
        </HStack>
        <HStack className="gap-3">
          <Text className="font-semibold">{formatCurrency(event.total_grand_total)}</Text>
          <Badge action="success">
              <BadgeText action="success">{event.status}</BadgeText>
          </Badge>
        </HStack>
        <HStack className="gap-2 items-center">
          <Icon as={CalendarDays} className="text-primary-500" />
          <Text>{formatFullDate(event.start_date)} - {formatFullDate(event.end_date)}</Text>
        </HStack>
        <HStack className="gap-2 items-center" >
          <Icon as={MapPin} className="text-primary-500" />
          <Text className="text-sm">{findBookingAddress(event.custom_fields)}</Text>
        </HStack>
        <PilledButton disabled={!getBEO(event.documents || [])} onPress={() => {
          const beoUrl = getBEO(event.documents || [])?.url;
          if (beoUrl) Linking.openURL(beoUrl);
        }}>
          <ButtonIcon as={NotepadText} />
          <ButtonText className="text-sm">Banquet Event Order</ButtonText>
        </PilledButton>
        <AccountManagerContact manager={event.contact as Contact} textClassName="text-pivot-blue" buttonClassName="border-pivot-blue" />
      </VStack>
      <VStack className="px-4 gap-3 flex-1">
        {/* //! NOTE: reanimated shared value resets when the dev app is hot-reloaded, make sure to include the rating prop */}
        <FeedbackStarRatingSection
          categoryRatings={criteria}
          onChangeRating={setCriteria}
        />
        <Text className="font-bold mt-1">
          Share more about your experience
        </Text>
        <Textarea size="sm" className="h-[70px]">
          <TextareaInput value={comment} onChangeText={setComment} />
        </Textarea>
        <AddPhotoButton onPhotoTaken={(photos) => dispatchFeedbackImages({ action: "addPhoto", items: photos })} />
        <FlatList data={feedbackImages} horizontal contentContainerClassName="gap-2"
          keyExtractor={item => item.id}
          className="min-h-[120px] rounded-lg overflow-hidden"
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => <FeedbackImage
            key={item.id}
            item={item}
            onRemovePhoto={() => dispatchFeedbackImages({ action: "removePhoto", id: item.id })}
            onCompletedUpload={() => dispatchFeedbackImages({ action: "completedUpload", id: item.id })}
          />}
        />
      </VStack>
    </SwipeUpView>
  </View>
};

const feedbackImageReducer = (feedbackImages: Array<ImageItem> = [], dispatch: FeedbackImageDispatch) => {
  switch (dispatch.action) {
    case "addPhoto":
      return [...feedbackImages, ...dispatch.items.map(item => ({
        id: item.assetId,
        uri: item.uri,
        uploaded: false,
        mimeType: item.mimeType || "image/jpeg",
        storagePath: getStorageFilePath(item.assetId, item.mimeType || "image/jpeg")
      }))];
    case "completedUpload":
      return feedbackImages.map(item => item.id === dispatch.id ? { ...item, uploaded: true } : item);
    case "removePhoto":
      return feedbackImages.filter(item => item.id !== dispatch.id);
    default:
      return feedbackImages;
  }
};

type FeedbackImageDispatch = {
  action: "completedUpload",
  id: string
} | {
  action: "removePhoto",
  id: string
} | {
  action: "addPhoto",
  items: Array<ImageAsset>
}