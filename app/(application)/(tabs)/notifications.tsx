import { SectionList } from "react-native";
import TabDashboardHeader from "@/components/shared/TabDashboardHeader";
import TabSafeAreaView from "@/components/shared/TabSafeAreaView";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";

const sections = [
  {
    title: "Today",
    data: [
      { id: "1", message: "Your booking has been confirmed." },
      { id: "2", message: "Chef Anna sent you a message." },
    ],
  },
  {
    title: "Yesterday",
    data: [],
  },
  {
    title: "7 days ago",
    data: [
      { id: "3", message: "Payment received for your event." },
      { id: "4", message: "Reminder: Event starts tomorrow." },
    ],
  },
];

export default function ApplicationNotificationScreen() {
  return (
    <TabSafeAreaView>
      <TabDashboardHeader title="Notifications" />
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item?.id ?? index.toString()}
        renderSectionHeader={({ section: { title } }) => (
          <Text className="text-xl font-bold px-4 pt-6 pb-2">{title}</Text>
        )}
        renderItem={({ item }) =>
          item ? (
            <Card
              size="md"
              variant="elevated"
              className="mb-4 mx-4 shadow-sm rounded-[8px]"
            >
              <Box className="flex-row justify-between items-start mb-2">
                <Text className="text-l font-bold text-gray-900">
                  {item.message}
                </Text>
              </Box>
              <Box className="flex-row justify-between items-start mb-2">
                <Text className="text-l text-gray-600">
                  Chicago Bulls @ Kansas City, MO starts today at 4:00pm Chicago
                  Bulls @ Kansas City, MO starts today at 4:00pm
                </Text>
              </Box>
              <Box className="flex-row justify-between items-start mb-2">
                <Text className="text-sm text-gray-500">4 hours ago</Text>
              </Box>
            </Card>
          ) : null
        }
        // BUG: ListEmptyComponent is not working.
        ListEmptyComponent={
          <Box className="items-center py-8 bg-slate-600">
            <Text className="text-xl text-gray-500">No notifications</Text>
          </Box>
        }
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </TabSafeAreaView>
  );
}
