import { Text } from "./ui/text";
import { VStack } from "./ui/vstack";
import { formatFullDate  } from "@/helpers"

export default function AgendaEventCard({ event }: { event: TripleseatEvent }) {
    console.log("🚀 ~ AgendaEventCard ~ event:", event.start_date)
    return (<VStack className="bg-white rounded-lg p-2 w-full h-[100px] justify-center items-center">
        <Text>{formatFullDate(event.start_date)} - {formatFullDate(event.end_date)}</Text>
        <Text>{event.name}</Text>
    </VStack>)
}