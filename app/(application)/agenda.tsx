import React from "react";
import { StyleSheet } from "react-native";

import { Text } from "@/components/ui/text";
import TabDashboardHeader from "@/components/shared/TabDashboardHeader";
import TabSafeAreaView from "@/components/shared/TabSafeAreaView";

export default function ApplicationAgendaScreen() {
  return (
    <TabSafeAreaView>
      <TabDashboardHeader />
      <Text>Agenda Screen</Text>
    </TabSafeAreaView>
  );
}
