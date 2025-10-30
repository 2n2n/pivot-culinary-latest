import { Tabs } from "expo-router";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
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
          headerShown: true,
          headerShadowVisible: false,
          headerLeft: () => <AppAdaptiveLogo className="ml-4" size="xs" />,
          headerRight: () => (
            <Box className="flex flex-row mr-4">
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
                    {selectedAccount?.name?.replace("-", "")?.toUpperCase() ||
                      "U"}
                  </AvatarFallbackText>
                </Avatar>
              </Button>
            </Box>
          ),
        }}
      />
      <Box className="py-2 bg-white">
        <Text className="text-center text-2xl font-semibold text-gray-900 px-4 mb-2">
          {title}
        </Text>
      </Box>
      <AccountModal />
    </>
  );
};

export default TabDashboardHeader;
