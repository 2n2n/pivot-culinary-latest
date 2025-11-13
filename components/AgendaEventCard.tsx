import { findBookingAddress, formatCurrency } from "@/helpers";
import { Badge, BadgeText } from "@/components/ui/badge";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";

import { MapPinIcon, UsersIcon } from "lucide-react-native";

export default function AgendaEventCard({ event }: { event: TripleseatEvent }) {
    return (<VStack className="bg-white rounded-lg p-3 w-full gap-1">
        <HStack className="justify-between items-center">
            <Text className="text-pivot-blue text-sm">{event.event_start_time} - {event.event_end_time}</Text>
            <HStack className="gap-1 items-center">
                <Icon as={UsersIcon} className="text-primary-500" size="sm" />
                <Text className="text-sm text-pivot-blue">{event.guest_count || 0}</Text>
            </HStack>
        </HStack>
        <Text className="text-pivot-blue font-bold">{event.name}</Text>
        <HStack>
            <Text className="text-pivot-blue text-sm font-bold">{formatCurrency(event.booking.total_event_grand_total)}</Text>
            <Badge action="success">
                <BadgeText className="text-2xs">{event.status}</BadgeText>
            </Badge>
            // TODO: add event review star component
        </HStack>
        <HStack className="items-center gap-1">
            <Icon as={MapPinIcon} className="text-primary-500" size="md" />
            <Text className="text-pivot-blue text-sm flex-1">{findBookingAddress(event.custom_fields)}</Text>
        </HStack>
        // TODO: add post feedback button
    </VStack>)
}