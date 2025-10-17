import React from "react";

import TabDashboardHeader from "@/components/shared/TabDashboardHeader";
import TabSafeAreaView from "@/components/shared/TabSafeAreaView";
import Agenda from "@/components/Agenda";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

export default function ApplicationAgendaScreen() {
  return (
    <TabSafeAreaView >
      <TabDashboardHeader title="Calendar of Activities" />
      <Agenda 
        items={[
          { date: new Date("2025-10-14"), items: [-3, -2, -1] },
          { date: new Date("2025-10-15"), items: [0, 1, 2] },
          { date: new Date("2025-10-16"), items: [1, 2, 3] },
          { date: new Date("2025-10-17"), items: [4, 5, 6] },
          { date: new Date("2025-10-18"), items: [7, 8, 9] },
          { date: new Date("2025-10-21"), items: [16, 17, 18] },
          { date: new Date("2025-10-22"), items: [19, 20, 21] },
          { date: new Date("2025-10-24"), items: [25, 26, 27] },
        ]}
        dateRangeStart={new Date("2025-10-15")}
        dateRangeEnd={new Date("2025-11-22")}
        // TODO: loading and refresh state
        isLoading={true} 
        isRefreshing={false}
        onRefresh={() => {}}
        options={
          {
            displayedStartingWeekDay: "monday", // dictates where the week should start from
          }
        }
        renderItem={(item, date, index) => <VStack className="bg-white rounded-lg p-2 w-full h-[100px] justify-center items-center" key={`${date}-${index}`}>
          <Text>Item #</Text>
          <Text>{item}</Text>
        </VStack>}
      />
    </TabSafeAreaView>
  );
}
