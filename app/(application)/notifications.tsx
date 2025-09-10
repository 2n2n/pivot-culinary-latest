import TabDashboardHeader from "@/components/shared/TabDashboardHeader";
import TabSafeAreaView from "@/components/shared/TabSafeAreaView";
import { Text } from "@/components/Themed";

export default function ApplicationNotificationScreen() {
  return (
    <TabSafeAreaView>
      <TabDashboardHeader />
      <Text>Notificaitons</Text>
    </TabSafeAreaView>
  );
}
