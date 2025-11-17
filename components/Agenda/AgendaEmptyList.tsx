import { AccountModalContext } from "@/services/account_modal/AccountModalProvider";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";

import { Inbox } from "lucide-react-native";
import { View } from "react-native";
import { useContext } from "react";


export default function AgendaEmptyList() {
    const { selectedAccount } = useContext(AccountModalContext)
    return <VStack className="flex-1 gap-4 items-center justify-center h-full">
    {/* Central Illustration */}
    <View className="relative items-center justify-center">
      {/* Wi-Fi Signal Icon */}
      <View className="mb-2">
        <Inbox size={64} color="#D1D5DB" strokeWidth={1.5} />
      </View>
    </View>

    {/* Text Content */}
    <VStack className="gap-1 items-center">
      <Text className="text-2xl font-semibold text-gray-300">
        No agenda at this moment
      </Text>
      <Text className="text-base text-gray-400 text-center max-w-[80%]">
        We didn't find any activities for{" "}
        <Text className="font-bold text-gray-400">
          {selectedAccount?.name || "this account"}
        </Text>{" "}
        check again later.
      </Text>
    </VStack>
  </VStack>
}