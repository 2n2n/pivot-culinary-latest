import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { formatFullDate  } from "@/helpers";
import { Text } from "@/components/ui/text";

export default function AgendaEventCard({ event }: { event: TripleseatEvent }) {
    return (<VStack className="bg-white rounded-lg p-2 w-full">
        <Text>{formatFullDate(event.start_date)} - {formatFullDate(event.end_date)}</Text>
        <HStack className="justify-between">
            <Text>{event.event_start_time} - {event.event_end_time}</Text>
            <HStack>
                <Text>{event.guest_count || 0}</Text>
            </HStack>
        </HStack>
        <Text>{event.name}</Text>

    </VStack>)
}