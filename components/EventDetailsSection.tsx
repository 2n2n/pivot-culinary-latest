import { Calendar1, MapPin, NotepadText } from "lucide-react-native";
import { Icon } from "./ui/icon";
import { Badge } from "./ui/badge";
import { BadgeText } from "./ui/badge";
import { ButtonIcon, ButtonText, Button } from "./ui/button";
import { Box } from "./ui/box";
import { HStack } from "./ui/hstack";
import { VStack } from "./ui/vstack";
import { Text } from "./ui/text";
import {
  findBookingAddress,
  formatCurrency,
  formatFullDate,
  getBEO,
} from "@/helpers";
import { useMemo } from "react";
import { Linking } from "react-native";

const EventDetailsSection = ({ event }: { event: TripleseatEvent }) => {
  const beo = useMemo(() => {
    if (event && event.documents) return getBEO(event.documents) || null;
    else return null;
  }, [event]);

  return (
    <Box className="px-4">
      <VStack className="gap-0">
        <Text className="text-l text-white text-sm font-bold">
          {event?.event_start_time} - {event?.event_end_time}
        </Text>
        <Text className="text-white text-2xl font-bold w-full">
          {event.name}
        </Text>
      </VStack>
      <VStack className="gap-4">
        <HStack className="gap-4 flex items-center">
          <Text className="text-l font-bold text-white/90 text-base">
            {formatCurrency(event?.grand_total)}
          </Text>
          <Badge action="success">
            <BadgeText className="text-2xs">
              {event?.status?.toUpperCase()}
            </BadgeText>
          </Badge>
        </HStack>
        <VStack className="gap-2">
          <HStack>
            <Icon as={Calendar1} className="w-5 h-5 text-primary-500 mr-2" />
            <Text className="text-sm font-medium text-white">
              {formatFullDate(event?.start_date || "")} -{" "}
              {formatFullDate(event?.end_date || "")}
            </Text>
          </HStack>
          <HStack>
            <Icon as={MapPin} className="w-5 h-5 text-primary-500 mr-2" />
            <Text className="text-sm font-medium text-white">
              {findBookingAddress(event?.custom_fields || [])}
            </Text>
          </HStack>
        </VStack>
        <Button
          disabled={!beo}
          onPress={() => {
            if (beo) Linking.openURL(beo.url);
          }}
          size="lg"
          className="bg-primary-500 rounded-full mb-2"
        >
          <ButtonIcon as={NotepadText} className="w-5 h-5 text-white mr-2" />
          <ButtonText className=" text-white">Banquet Event Order</ButtonText>
        </Button>
      </VStack>
    </Box>
  );
};

export default EventDetailsSection;
