import { AccountModalContext } from "@/services/account_modal/AccountModalProvider";
import useEvents from "@/hooks/useEvents";

import { useQuery } from "@tanstack/react-query";
import { compareDesc } from "date-fns";
import { useContext } from "react";

export default function useBookingEvents(bookingId: string) {
    const accountModalContext = useContext(AccountModalContext);
    const eventsQuery = useEvents(accountModalContext.selectedAccount?.id);
    const bookingEventsQuery = useQuery({
        queryKey: ["booking", bookingId, "events"],
        enabled: !!bookingId && !!accountModalContext.selectedAccount?.id,
        queryFn: () => {
            const safeBookingId = Number(bookingId);
            if (!eventsQuery?.data?.length || isNaN(safeBookingId)) return [];
            const events: Array<TripleseatEvent> = [];
            for (let index = 0; index < eventsQuery.data.length; index++) {``
                const event = eventsQuery.data[index];
                if (event.booking.id === safeBookingId) events.push(event);
            }
            const sortedEvents = events.sort((a, b) => compareDesc(new Date(a.start_date), new Date(b.start_date)));
            return sortedEvents;
        }
    });
    return bookingEventsQuery;
};