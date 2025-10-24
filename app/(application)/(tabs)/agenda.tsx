import React, { useEffect, useState } from "react";

import TabDashboardHeader from "@/components/shared/TabDashboardHeader";
import TabSafeAreaView from "@/components/shared/TabSafeAreaView";
import Agenda from "@/components/Agenda/Agenda";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

const mockData = [
  { date: new Date("2025-10-18"), items: [-3, -2, -1] },
  { date: new Date("2025-10-21"), items: [0, 1, 2] },
  { date: new Date("2025-10-22"), items: [1, 2, 3] },
  { date: new Date("2025-10-24"), items: [4, 5, 6] },
  { date: new Date("2025-10-25"), items: [7, 8, 9] },
  { date: new Date("2025-10-28"), items: [16, 17, 18] },
  { date: new Date("2025-10-29"), items: [19, 20, 21] },
  { date: new Date("2025-10-30"), items: [25, 26, 27] },
]

export default function ApplicationAgendaScreen() {
  const [items, setItems] = useState(mockData);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMoreItems, setIsLoadingMoreItems] = useState(false);
  const [hasLoadedAllItems, setHasLoadedAllItems] = useState(false);
  const [hasOutdatedItems, setHasOutdatedItems] = useState(false);
  const [dateRangeStart, setDateRangeStart] = useState(new Date("2025-10-16"));
  const [dateRangeEnd, setDateRangeEnd] = useState(new Date("2025-11-05"));
  const handleRefresh = () => {
    setIsRefreshing(true);
    // TODO: implement refresh logic
    setTimeout(() => {
      setIsRefreshing(false);
      setHasOutdatedItems(false);
    }, 2500);
  }
  const handleLoadMore = () => {
    setIsLoadingMoreItems(true);
    setTimeout(() => {
      // TODO: implement infinite query for loading more items
      setItems([...mockData, { date: new Date("2025-11-02"), items: [28, 29, 30] }])
      setIsLoadingMoreItems(false);
      setHasLoadedAllItems(true);
    }, 2500);
  }
  useEffect(() => {
    const timeout = setTimeout(() => {
      // TODO: implement fetching and loading of data
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timeout);
  }, []);
  useEffect(() => {
    if (hasOutdatedItems) return;
    // TODO: Change with implementation for listening outdated or stale data
    const timeout = setTimeout(() => setHasOutdatedItems(true), 60000);
    return () => clearTimeout(timeout);
  }, [hasOutdatedItems])
  return (
    <TabSafeAreaView >
      <TabDashboardHeader title="Calendar of Activities" />
      <Agenda 
        items={items}
        dateRangeStart={dateRangeStart}
        initialDateRangeEnd={dateRangeEnd}
        // initialSelectedDate={new Date("2025-10-20")}
        isLoading={isLoading} // initial loading, displays ui skeleton
        hasOutdatedItems={hasOutdatedItems}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        isLoadingMoreItems={isLoadingMoreItems}
        onLoadMoreItems={handleLoadMore}
        hasLoadedAllItems={hasLoadedAllItems}
        options={{
          displayedStartingWeekDay: "monday", // dictates where the week should start from
        }}
        renderItem={item => <VStack 
          className="bg-white rounded-lg p-2 w-full h-[100px] justify-center items-center"
        >
          <Text>Item #</Text>
          <Text>{item}</Text>
        </VStack>}
      />
    </TabSafeAreaView>
  );
}
