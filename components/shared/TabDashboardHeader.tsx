import { Tabs } from "expo-router";
import { Alert } from "react-native";
import { Search } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import PivotIcon from "@/components/SvgIcons/PivotIcon";
import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import AccountModal from "@/services/account_modal/component/AccountModal";
import { useModal } from "@/services/account_modal/hooks/useModal";
import AppAdaptiveLogo from "./AppAdaptiveLogo";

const TabDashboardHeader = ({ title = "" }: { title?: string }) => {
  const { setShow, selectedAccount } = useModal();

  return (
    <>
      <Tabs.Screen
        options={{
          title: "",
          headerShown: true,
          headerShadowVisible: false,
          headerLeft: () => <AppAdaptiveLogo className="ml-4" size="xs" />,
          headerRight: () => (
            <Box className="flex flex-row mr-4">
              <Button
                variant="link"
                onPress={() => {
                  // CHORE: Implement actual search functionality
                  Alert.alert("Search", "Search functionality coming soon");
                }}
                className="w-10 h-10 rounded-full p-0 items-center justify-center"
              >
                <Icon as={Search} />
              </Button>
              <Button
                variant="link"
                onPress={() => {
                  setShow(true);
                }}
                className="ml-3"
              >
                <Avatar className="bg-primary-500">
                  <AvatarFallbackText>
                    {/* CHORE: Make profile image dynamic based on the active account */}
                    {selectedAccount?.contact?.title
                      ?.charAt(0)
                      ?.toUpperCase() || "U"}
                  </AvatarFallbackText>
                </Avatar>
              </Button>
            </Box>
          ),
        }}
      />
      {title && <Box className="py-2 bg-white">
        <Text className="text-lg font-bold text-gray-900 px-4 mb-2">
          {title}
        </Text>
      </Box>}
      <AccountModal />
    </>
  );
};

export default TabDashboardHeader;
