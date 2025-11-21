import { getEventById } from "@/requests/events.request";
import { useQuery } from "@tanstack/react-query";

export default function useTripleseatEvent(eventId: string) {
    const eventQuery = useQuery({
        queryKey: ["tripleseat", "event", eventId],
        queryFn: async () => {
            return await getEventById(eventId);
        },
        staleTime: 1000 * 60 * 60 * 24, // 1 day in milliseconds
        gcTime: 1000 * 60 * 60 * 24, // 1 day in milliseconds
        enabled: !!eventId,
    });
    return eventQuery;
};