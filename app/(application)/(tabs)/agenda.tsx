import React, { useContext, useMemo } from "react";

import { AccountModalContext } from "@/services/account_modal/AccountModalProvider";
import TabDashboardHeader from "@/components/shared/TabDashboardHeader";
import TabSafeAreaView from "@/components/shared/TabSafeAreaView";
import Agenda from "@/components/Agenda/Agenda";
import useEvents from "@/hooks/useEvents";
import AgendaEventCard from "@/components/AgendaEventCard";
import { compareDesc } from "date-fns";

export default function ApplicationAgendaScreen() {
  const { selectedAccount } = useContext(AccountModalContext);
  const { data, isPending, isRefetching, refetch, isStale} = useEvents(selectedAccount?.id);
  const groupedEvents = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return [];
    const mappedEvents: Map<string, Array<any>> = new Map();
    for (const event of data) {
      const stringDate = event.start_date;
      if (!stringDate) continue;
      if (mappedEvents.has(stringDate)) mappedEvents.get(stringDate)?.push(event);
      else mappedEvents.set(stringDate, [event]);
    };
    return Array.from(mappedEvents.entries()).map(([, events]: [string, TripleseatEvent[]]) => ({
      date: new Date(events[0].start_date),
      // TODO: Sorting by time needs to be on request
      items: events.sort((a, b) => compareDesc(new Date(a.start_date), new Date(b.start_date))),
    }));
  }, [data]);
  return (
    <TabSafeAreaView>
      <TabDashboardHeader title="Calendar of Activities" />
      {/** TODO Fix type of items */}
      <Agenda
        items={groupedEvents}
        isLoading={isPending} // initial loading, displays ui skeleton
        hasOutdatedItems={isStale}
        isRefreshing={isRefetching}
        onRefresh={refetch}
        options={{
          displayedStartingWeekDay: "monday", // dictates where the week should start from
        }}
        renderItem={item => <AgendaEventCard event={item} />}
      />
    </TabSafeAreaView>
  );
}
