import AgendaEventCardPostFeedbackButton from "@/components/AgendaEventCard/AgendaEventCardPostFeedbackButton";
import AgendaEventCardStarRating from "@/components/AgendaEventCard/AgendaEventCardStarRating";
import AgendaDirectusEventCard from "@/components/AgendaEventCard/AgendaDirectusEventCard";
import { AccountModalContext } from "@/services/account_modal/AccountModalProvider";
import AgendaEventCard from "@/components/AgendaEventCard/AgendaEventCard";
import TabDashboardHeader from "@/components/shared/TabDashboardHeader";
import TabSafeAreaView from "@/components/shared/TabSafeAreaView";
import Agenda from "@/components/Agenda/Agenda";

import useDirectusEvents from "@/hooks/useDirectusEvents";
import useEvents from "@/hooks/useEvents";

import React, { useContext, useMemo } from "react";
import { compareDesc, isToday } from "date-fns";

export default function ApplicationAgendaScreen() {
  const { selectedAccount } = useContext(AccountModalContext);
  const tripleseatEventsQueryResult = useEvents(selectedAccount?.id);
  const directusEventsQueryResult = useDirectusEvents();
  const isRefetching = tripleseatEventsQueryResult.isRefetching || directusEventsQueryResult.isRefetching;
  const isPending = tripleseatEventsQueryResult.isPending || directusEventsQueryResult.isPending;
  const isStale = tripleseatEventsQueryResult.isStale || directusEventsQueryResult.isStale;
  const groupedEvents = useMemo(() => {
    const start = performance.now();
    const mappedEvents: Map<string, Array<GenericEvent>> = new Map();
    // type of event implementation
    const typedTripleseatEvents: GenericEvent[] = tripleseatEventsQueryResult?.data?.map(event => ({ ...event, type: "tripleseat-event" })) ?? [];
    const typedDirectusEvents: GenericEvent[] = directusEventsQueryResult?.data?.map(event => ({ ...event, type: "directus-event" })) ?? [];
    //! NOTE: Sorted by start_date, this will break if the directus events do not have a start_date property.`
    const sortedEvents = [...typedTripleseatEvents, ...typedDirectusEvents].sort((a, b) => compareDesc(new Date(a.start_date), new Date(b.start_date)));
    insertMappingByStartDate(mappedEvents, sortedEvents);
    const groupedEvents = Array.from(mappedEvents.entries()).map(([, events]: [string, Array<GenericEvent>]) => ({
      date: new Date(events[0].start_date),
      items: events,
    }));
    const end = performance.now();
    console.log(`Grouped events in ${(end - start).toFixed(2)} ms`);
    return groupedEvents;
  }, [tripleseatEventsQueryResult.data, directusEventsQueryResult.data]);
  const refetch = () => {
    tripleseatEventsQueryResult.refetch();
    directusEventsQueryResult.refetch();
  };
  return (
    <TabSafeAreaView>
      <TabDashboardHeader title="Calendar of Activities" />
      <Agenda
        items={groupedEvents}
        isLoading={isPending} // initial loading, displays ui skeleton
        hasOutdatedItems={isStale}
        isRefreshing={isRefetching}
        onRefresh={refetch}
        options={{
          displayedStartingWeekDay: "monday", // dictates where the week should start from
        }}
      />
    </TabSafeAreaView>
  );
};

const insertMappingByStartDate = (mappedEvents: Map<string, Array<GenericEvent>>, events: Array<GenericEvent>) => {
  for (const event of events) {
    const stringDate = event.start_date;
    if (!stringDate) continue;
    if (mappedEvents.has(stringDate)) mappedEvents.get(stringDate)?.push(event);
    else mappedEvents.set(stringDate, [event]);
  }
};