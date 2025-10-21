import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Check } from "lucide-react-native";
import { HStack } from "@/components/ui/hstack";

import { getAccountLocation } from "@/helpers";
import { useColorScheme } from "nativewind/dist/stylesheet";

const AccountModalItem = ({
  account,
  isSelected,
  onPress,
}: {
  account: Account;
  isSelected: boolean;
  onPress: (account: Account) => void;
}) => {
  // DOCS: Get the current theme mode (light or dark) via React Native context
  // NOTE: The recommended approach in Expo/React Native is to use the useColorScheme hook from 'react-native'
  const theme = useColorScheme().colorScheme; // 'light' | 'dark' | null
  return (
    <Button
      key={account.id}
      className="w-full h-auto flex flex-row items-center justify-between py-3 my-1"
      variant="link"
      onPress={() => onPress(account)}
    >
      <HStack className="gap-2 flex flex-row items-center">
        <Avatar
          className={`w-12 h-12 mr-3 bg-green-800 ${
            getAccountLocation(account) === "PIVOT"
              ? "bg-tertiary-500"
              : "bg-success-200"
          }`}
        >
          <AvatarFallbackText>
            {(account?.name || "").replace("-", "")}
          </AvatarFallbackText>
        </Avatar>
        <Box className="flex flex-col flex-1">
          <Text
            className="text-sm font-bold break-words whitespace-pre-line flex-shrink flex-wrap"
            numberOfLines={2}
          >
            {account?.name}
          </Text>
          <Text className="text-sm text-gray-500">
            {getAccountLocation(account) === "PIVOT"
              ? "Pivot Culinary"
              : "Game day"}
          </Text>
        </Box>
        {isSelected && (
          <Icon
            as={Check}
            className={
              theme === "light" ? "text-tertiary-500" : "text-success-200"
            }
            size="md"
          />
        )}
      </HStack>
    </Button>
  );
};

export default AccountModalItem;
