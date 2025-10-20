import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Check } from "lucide-react-native";
import { HStack } from "@/components/ui/hstack";

import { getAccountLocation } from "@/helpers";

const AccountModalItem = ({
  account,
  isSelected,
  onPress,
}: {
  account: Account;
  isSelected: boolean;
  onPress: (account_id: number) => void;
}) => {
  return (
    <Button
      key={account.id}
      className="w-full h-auto flex flex-row items-center justify-between py-2 my-1"
      variant="link"
      onPress={() => onPress(account.id)}
    >
      <HStack className="gap-2 flex flex-row items-center">
        <Avatar
          className={`w-12 h-12 mr-3 bg-green-800 ${
            getAccountLocation(account) === "PIVOT"
              ? "bg-primary-500"
              : "bg-green-800"
          }`}
        >
          <AvatarFallbackText>
            {(account?.name || "").replace("-", "")}
          </AvatarFallbackText>
        </Avatar>
        <Box className="flex flex-col flex-1">
          <Text
            className="text-lg font-bold break-words whitespace-pre-line flex-shrink flex-wrap"
            numberOfLines={2}
          >
            {account?.name}
          </Text>
          <Text className="text-sm text-gray-500">
            {getAccountLocation(account)}
          </Text>
        </Box>
        {isSelected && (
          <Icon as={Check} className="text-orange-500" size={20} />
        )}
      </HStack>
    </Button>
  );
};

export default AccountModalItem;
