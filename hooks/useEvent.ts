import { getEventById } from "@/requests/events.request";
import { useQuery } from "@tanstack/react-query";

export default function useEvent(eventId: string) {
    const eventQuery = useQuery({
        queryKey: ["event", eventId],
        queryFn: async () => {
            return await getEventById(eventId);
        },
    });
    return eventQuery;
};