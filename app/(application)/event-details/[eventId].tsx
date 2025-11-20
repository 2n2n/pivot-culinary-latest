import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "@/components/ui/actionsheet";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Badge, BadgeText } from "@/components/ui/badge";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Center } from "@/components/ui/center";
import { Image } from "@/components/ui/image";
import { Icon } from "@/components/ui/icon";
import { Box } from "@/components/ui/box";

import {
  BookDashed,
  Calendar1,
  MapPin,
  NotepadText,
  Plus,
  Search,
  Star,
} from "lucide-react-native";
import { Text, Alert, SafeAreaView, FlatList, Dimensions } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import { useContext, useEffect, useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useEvents from "@/hooks/useEvents";
import { AccountModalContext } from "@/services/account_modal/AccountModalProvider";
import EventDetailsSection from "@/components/EventDetailsSection";

const FEEDBACKS = [
  {
    customer: {
      name: "Deen Notz",
      role: "Customer",
      avatar: {
        uri: "data:image/png;base64,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",
      },
    },
    comment:
      "The food was great and the service was excellent. I would definitely recommend this event to my friends.",
    taste: 4.1,
    quality: 3.2,
    service: 4.3,
    rating: 3.2,
    timestamp: new Date(),
    photos: [
      {
        uri: "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        uri: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=1010&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        uri: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        uri: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
  },
  {
    customer: {
      name: "Reinhart Logronio",
      role: "Dev",
      avatar: {
        uri: "data:image/png;base64,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",
      },
    },
    comment:
      "The food was great and the service was excellent. I would definitely recommend this event to my friends.",
    taste: 4.5,
    quality: 3.4,
    service: 4.1,
    rating: 5.2,
    timestamp: new Date(),
    photos: [
      {
        uri: "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        uri: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=1010&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        uri: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
  },
  {
    customer: {
      name: "Reinhart Logronio",
      role: "Hellower",
      avatar: {
        uri: "data:image/png;base64,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",
      },
    },
    comment:
      "The food was great and the service was excellent. I would definitely recommend this event to my friends.",
    taste: 4.5,
    quality: 3.4,
    service: 4.1,
    rating: 4.4,
    timestamp: new Date(),
    photos: [
      {
        uri: "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        uri: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=1010&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
  },
  {
    customer: {
      name: "Brok Colene",
      role: "Reviewer",
      avatar: {
        uri: "data:image/png;base64,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",
      },
    },
    comment:
      "The food was great and the service was excellent. I would definitely recommend this event to my friends.",
    taste: 4.1,
    quality: 3.2,
    service: 4.3,
    rating: 2.7,
    timestamp: new Date(),
    photos: [
      {
        uri: "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
  },
];

export default function EventDetailsScreen() {
  const [feedbacksSheetOpen, setFeedbacksSheetOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const route = useRouter();
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const { selectedAccount } = useContext(AccountModalContext);
  const { data: eventDataList } = useEvents(selectedAccount?.id);

  const event = eventDataList?.find((event) => event.id === Number(eventId));

  // TODO: Make these dynamic based on the event data
  const HAS_FEEDBACKS = true;
  const RATING = 4.5;
  // REVIEW: Only Selected feedback are feedbacks with images
  const FEEDBACK_GALLERY_DATA = [
    {
      avatar: {
        uri: "data:image/png;base64,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",
      },
      comment:
        "The food was great and the service was excellent. I would definitely recommend this event to my friends.",
      photo: {
        uri: "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    },
    {
      avatar: {
        uri: "data:image/png;base64,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",
      },
      comment: "Hello World.",
      photo: {
        uri: "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    },
  ];
  const FEEDBACK_CATEGORIES = [
    { category: "Taste", value: 32 },
    { category: "Timeliness", value: 50 },
    { category: "Service", value: 25 },
  ];

  const handleFeedbacksSheetOpen = () => {
    setFeedbacksSheetOpen(true);
  };

  const handleFeedbacksSheetClose = () => {
    setFeedbacksSheetOpen(false);
  };

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={{ paddingTop: -insets.top, paddingBottom: -insets.bottom }}
    >
      <Stack.Screen
        options={{
          headerTitle: "",
          headerBackTitle: "Event Details",
        }}
      />
      <Image
        source={require("@/assets/images/header-default-background.png")}
        className="absolute w-full h-1/2 left-0 right-0"
        resizeMode="cover"
        alt="image"
      />
      <VStack className="flex-1 gap-2 mt-4">
        {/** event title and cover */}
        <EventDetailsSection event={event as TripleseatEvent} />
        {/** event content */}
        <VStack className="flex-1 p-4 gap-4 bg-white justify-between">
          <Text className="text-xl font-bold">Customer Feedback</Text>
          {/** FEEDBACK SUMMARY */}
          <VStack className="gap-2">
            <Center className="gap-2">
              <Text className="font-bold">Average Rating</Text>
              <Text className="text-2xl font-semibold">{RATING}</Text>
              <HStack className="gap-1">
                {/* {Array.from({ length: Math.round(RATING) }).map((_, i) => (
                  <Icon key={i} as={Star} />
                ))} */}
              </HStack>
            </Center>
            {FEEDBACK_CATEGORIES.map((category) => (
              <VStack key={category.category}>
                <HStack className="items-center gap-2">
                  <Text className="min-w-[80px]">{category.category}</Text>
                  <Progress
                    value={category.value}
                    className="flex-1"
                    orientation="horizontal"
                  >
                    <ProgressFilledTrack className="bg-primary-500" />
                  </Progress>
                </HStack>
              </VStack>
            ))}
          </VStack>
          {/** FEEDBACK SUMMARY */}

          {/** GALLERY VIEW */}
          <VStack className="gap-2 flex-1">
            <Text className="text-xl font-semibold">Gallery</Text>
            {/** TODO: Implement Grid or Masonry layout if more preferable */}
            <FlatList
              horizontal
              data={FEEDBACK_GALLERY_DATA}
              contentContainerClassName=""
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => <Box className="w-3" />}
              renderItem={({ item: feedback }) => (
                <Box className="relative min-w-[200px] h-full rounded-lg overflow-hidden">
                  <Image
                    source={feedback.photo.uri}
                    alt="Feedback Image"
                    className="w-full h-full object-cover"
                  />
                  <HStack className="absolute top-0 left-0 w-full p-2 gap-2 bg-black/75">
                    <Avatar size="sm">
                      <AvatarImage
                        source={feedback.avatar}
                        alt="Feedback Image"
                      />
                      <AvatarFallbackText>USER</AvatarFallbackText>
                    </Avatar>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      className="flex-1 text-sm font-medium text-white"
                    >
                      {feedback.comment}
                    </Text>
                  </HStack>
                </Box>
              )}
              ListEmptyComponent={
                <VStack className="flex-1 gap-3 p-4">
                  <Text className="font-bold">Customer Feedback</Text>
                  <Center className="flex-1 p-4 gap-3">
                    <Icon as={BookDashed} size={48} />
                    <Text>This event has no FEEDBACKS yet</Text>
                  </Center>
                </VStack>
              }
            />
          </VStack>
          {/** GALLERY VIEW */}
        </VStack>{" "}
        {/** BOTTOM NAVIGATION */}
        <HStack className="gap-2 px-4">
          <Button
            disabled={!HAS_FEEDBACKS}
            size="lg"
            variant="outline"
            className="flex-[0.6] rounded-full border-primary-500 bg-white"
            onPress={handleFeedbacksSheetOpen}
          >
            <ButtonIcon className="text-primary-500" as={NotepadText} />
            <ButtonText className="text-primary-500">Feedbacks</ButtonText>
          </Button>
          <Button
            size="lg"
            className="flex-[0.4] rounded-full bg-primary-500"
            onPress={() => route.push("/feedback/1")}
          >
            <ButtonIcon as={Plus} />
            <ButtonText>Post</ButtonText>
          </Button>
        </HStack>
      </VStack>
      {/** FEEDBACKS SHEET */}
      <ReviewsActionsSheet
        show={feedbacksSheetOpen}
        onCloseHandler={handleFeedbacksSheetClose}
      />
    </SafeAreaView>
  );
}

function ReviewsActionsSheet({
  show = false,
  onCloseHandler,
}: {
  show?: boolean;
  onCloseHandler: () => void;
}) {
  return (
    <Actionsheet isOpen={show} onClose={onCloseHandler} snapPoints={[90]}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <VStack className="items-start gap-4 mt-4">
          <Text className="text-xl font-bold">Reviews</Text>
          <FlatList
            data={FEEDBACKS}
            showsVerticalScrollIndicator={false}
            renderItem={({ item: feedback }) => (
              <VStack className="gap-3">
                <HStack className="justify-between items-center">
                  {/** FEEDBACK USER */}
                  <HStack className="flex-1 gap-3 items-start">
                    <Avatar>
                      <AvatarImage
                        source={feedback.customer.avatar}
                        alt="Feedback Image"
                        className="bg-gray-300"
                      />
                      <AvatarFallbackText>USER</AvatarFallbackText>
                    </Avatar>
                    <VStack className="gap-1 flex-1">
                      <Text className="font-semibold">
                        {feedback.customer.name}
                      </Text>
                      <VStack className="flex-1 gap-0">
                        <HStack className="flex justify-between items-center">
                          <Text>{feedback.customer.role}</Text>
                          <Text className="text-sm text-gray-500">
                            {
                              `3 weeks ago` /* {feedback.timestamp.toLocaleDateString()} */
                            }
                          </Text>
                        </HStack>

                        <HStack className="gap-2">
                          {/* {Array.from({
                            length: Math.round(feedback.rating),
                          }).map((_, i) => (
                            <Icon key={i} as={Star} size={16} />
                          ))} */}
                        </HStack>
                      </VStack>
                    </VStack>
                  </HStack>
                </HStack>
                <HStack className="gap-2 flex-wrap">
                  <Badge variant="outline" action="info">
                    <BadgeText>Taste: {feedback.taste}</BadgeText>
                  </Badge>
                  <Badge variant="outline" action="info">
                    <BadgeText>Quality: {feedback.quality}</BadgeText>
                  </Badge>
                  <Badge variant="outline" action="info">
                    <BadgeText>Service: {feedback.service}</BadgeText>
                  </Badge>
                  <Badge variant="outline" action="info">
                    <BadgeText>Taste: {feedback.taste}</BadgeText>
                  </Badge>
                  <Badge variant="outline" action="info">
                    <BadgeText>Quality: {feedback.quality}</BadgeText>
                  </Badge>
                  <Badge variant="outline" action="info">
                    <BadgeText>Service: {feedback.service}</BadgeText>
                  </Badge>
                </HStack>
                <Text>{feedback.comment}</Text>
                {feedback.photos?.length && (
                  <HStack className="min-h-[200px] gap-2">
                    <Image
                      source={feedback.photos[0].uri}
                      alt="Feedback Image"
                      className="flex-1 h-full rounded-lg"
                    />
                    {feedback.photos.length === 2 && (
                      <Image
                        source={feedback.photos[1].uri}
                        alt="Feedback Image"
                        className="flex-1 h-full rounded-lg"
                      />
                    )}
                    {feedback.photos.length === 3 && (
                      <VStack className="min-w-[100px] gap-2">
                        {feedback.photos.slice(1).map((photo) => (
                          <Image
                            key={photo.uri}
                            source={photo}
                            alt="Feedback Image"
                            className="flex-1 h-full w-full rounded-lg"
                          />
                        ))}
                      </VStack>
                    )}
                    {feedback.photos.length > 3 && (
                      <VStack className={"min-w-[100px] gap-2 relative"}>
                        <Image
                          key={feedback.photos[1].uri}
                          source={feedback.photos[1].uri}
                          alt="Feedback Image"
                          className="flex-1 h-full w-full rounded-lg"
                        />
                        <Box className="bg-black relative w-full flex-1 rounded-lg object-cover">
                          <Image
                            source={feedback.photos[2].uri}
                            alt="Feedback Image"
                            className="flex-1 h-full w-full rounded-lg opacity-60"
                          />
                          <Text className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-lg font-bold text-white text-center">
                            +{feedback.photos.length - 3}
                          </Text>
                        </Box>
                      </VStack>
                    )}
                  </HStack>
                )}
              </VStack>
            )}
            ItemSeparatorComponent={() => (
              <Box className="w-full border-b pb-5 mb-5 border-gray-300" />
            )}
            ListEmptyComponent={<Text>No feedbacks yet</Text>}
            ListFooterComponent={<Box className="h-5" />}
          />
        </VStack>
      </ActionsheetContent>
    </Actionsheet>
  );
}
