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
import { useMemo } from "react";
import getAccount from "@/requests/acccount.request";
import { useQuery } from "@tanstack/react-query";

const getActiveAccount = (accounts: Account[], account_id: number | null) => {
  return accounts.find((_account) => _account.account_id === account_id);
};

const TabDashboardHeader = ({ title = " " }: { title?: string }) => {
  const { setShow, accounts, selectedAccount } = useModal();

  const activeAccount = useMemo(() => {
    return getActiveAccount(accounts, selectedAccount);
  }, [accounts, selectedAccount]);

  const {
    data: accountInfo,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["account", activeAccount?.account_id],
    queryFn: () => getAccount(activeAccount?.account_id as number),
    enabled: !!activeAccount,
  });

  return (
    <>
      <Tabs.Screen
        options={{
          title: "",
          headerShown: true,
          headerShadowVisible: false,
          headerLeft: () => (
            <Text className="ml-5">
              <Icon as={PivotIcon} className="w-8 h-8" color="#F9832B" />
            </Text>
          ),
          headerRight: () => (
            <Box className="flex flex-row mr-5">
              <Button
                variant="link"
                onPress={() => Alert.alert("testing")}
                className="w-10 h-10 rounded-full p-0 items-center  justify-center"
              >
                <Icon as={Search} />
              </Button>
              {
                // TODO: Make profile image dynamic based on the active account.
              }
              <Button
                variant="link"
                onPress={() => {
                  setShow(true);
                }} // show modal function
                className="ml-3"
              >
                <Avatar className="bg-primary-500">
                  <AvatarFallbackText>{accountInfo?.name}</AvatarFallbackText>
                </Avatar>
              </Button>
            </Box>
          ),
        }}
      />
      <Box className="py-2 bg-white">
        <Text className="text-4xl font-bold text-gray-900 px-4 mb-2">
          {title}
        </Text>
      </Box>
      <AccountModal />
    </>
  );
};

export default TabDashboardHeader;
