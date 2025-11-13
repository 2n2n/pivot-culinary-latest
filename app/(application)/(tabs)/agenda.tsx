import React, { useContext, useMemo } from "react";

import { AccountModalContext } from "@/services/account_modal/AccountModalProvider";
import TabDashboardHeader from "@/components/shared/TabDashboardHeader";
import TabSafeAreaView from "@/components/shared/TabSafeAreaView";
import Agenda from "@/components/Agenda/Agenda";
import useEvents from "@/hooks/useEvents";
import AgendaEventCard from "@/components/AgendaEventCard";

export default function ApplicationAgendaScreen() {
  // TODO: hook for getting the currently active account
  const { selectedAccount } = useContext(AccountModalContext);
  const { data, isPending, isRefetching, refetch, isStale} = useEvents(selectedAccount?.id);
  const groupedEvents = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return [];
    const mappedEvents: Map<string, Array<any>> = new Map();
    for (const event of data) {
      // TODO: Fix types of events
      const stringDate = event.start_date;
      if (!stringDate) continue;
      if (mappedEvents.has(stringDate)) mappedEvents.get(stringDate)?.push(event);
      else mappedEvents.set(stringDate, [event]);
    };
    return Array.from(mappedEvents.entries()).map(([, events]) => ({
      date: new Date(events[0].start_date),
      items: events,
    }));
  }, [data]);
  return (
    <TabSafeAreaView>
      <TabDashboardHeader title="Calendar of Activities" />
      {/** TODO Fix type of items */}
      <Agenda<TripleseatEvent>
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
