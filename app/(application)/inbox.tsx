import TabDashboardHeader from "@/components/shared/TabDashboardHeader";
import TabSafeAreaView from "@/components/shared/TabSafeAreaView";
import { Text } from "@/components/Themed";

export default function ApplicationInboxScreen() {
  return (
    <TabSafeAreaView>
      <TabDashboardHeader />
      <Text>Inbox</Text>
    </TabSafeAreaView>
  );
}
