import authenticate from "@/requests";
import { getEvents, getEventsFromOtherPages } from "@/requests/events.request";
import { useQuery } from "@tanstack/react-query";

const useEvents = (accountId?: number | null) => {
  // CHORE: Force query to refetch when account?.id changes by including account?.id as part of the queryKey
  // The useQuery hook already listens to queryKey changes. "enabled" ensures the query only runs when account?.id is valid.
  const eventsQuery = useQuery({
    queryKey: ["events", accountId],
    queryFn: async () => {
      // TODO: Fix booking type
      let events: TripleseatEvent[] = [];
      const request = await authenticate();
      const { data, status }: EventRequestResponse = await getEvents(
        accountId as number,
        1, // fetch the first set of data.
        request
      );
      if (status === 200) {
        const results = await getEventsFromOtherPages(
          request,
          accountId?.toString() ?? "",
          data.total_pages
        );
        events = [...data.results, ...results];
      };
      return events;
    },
    staleTime: 1000 * 60 * 60 * 24, // 1 day in milliseconds
    gcTime: 1000 * 60 * 60 * 24, // 1 day in milliseconds
    // DOCS: This hook will automatically refetch when the account id changes due to the queryKey structure.
    enabled: !!accountId,
    // DOCS: This hook will only run if accountId is truthy (not null/undefined/empty string)
  });

  return eventsQuery;
};

export default useEvents;
