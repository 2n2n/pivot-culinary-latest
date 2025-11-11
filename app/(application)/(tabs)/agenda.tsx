import React, { useContext, useMemo } from "react";

import { AccountModalContext } from "@/services/account_modal/AccountModalProvider";
import TabDashboardHeader from "@/components/shared/TabDashboardHeader";
import TabSafeAreaView from "@/components/shared/TabSafeAreaView";
import Agenda from "@/components/Agenda/Agenda";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import useEvents from "@/hooks/useEvents";

const mockData = [
  { date: new Date("2025-10-18"), items: [-3, -2, -1] },
  { date: new Date("2025-10-21"), items: [0, 1, 2] },
  { date: new Date("2025-10-22"), items: [1, 2, 3] },
  { date: new Date("2025-10-24"), items: [4, 5, 6] },
  { date: new Date("2025-10-25"), items: [7, 8, 9] },
  { date: new Date("2025-10-28"), items: [16, 17, 18] },
  { date: new Date("2025-10-29"), items: [19, 20, 21] },
  { date: new Date("2025-10-30"), items: [25, 26, 27] },
];

export default function ApplicationAgendaScreen() {
  // TODO: hook for getting the currently active account
  const { selectedAccount } = useContext(AccountModalContext);
  const { data, isPending, isRefetching, refetch, isStale} = useEvents(selectedAccount?.id);
  const groupedEvents = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return [];
    const mappedEvents: Map<string, Array<any>> = new Map();
    for (const event of data) {
      // TODO: Fix types of events
      const stringDate = event.event_date;
      if (!stringDate) continue;
      if (mappedEvents.has(stringDate)) {
        mappedEvents.get(stringDate)?.push(event);
      } else {
        mappedEvents.set(stringDate, [event]);
      }
    };
    return Array.from(mappedEvents.entries()).map(([, events]) => ({
      date: new Date(events[0].event_start_utc),
      items: events,
    }));
  }, [data]);
  console.log("🚀 ~ ApplicationAgendaScreen ~ groupedEvents:", groupedEvents)
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
        renderItem={(item) => (
          <VStack className="bg-white rounded-lg p-2 w-full h-[100px] justify-center items-center">
            <Text>Item #</Text>
            <Text>{item.name}</Text>
          </VStack>
        )}
      />
    </TabSafeAreaView>
  );
}
