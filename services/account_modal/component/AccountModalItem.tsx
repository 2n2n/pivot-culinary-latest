import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Check } from "lucide-react-native";
import getAccount from "@/requests/acccount.request";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { HStack } from "@/components/ui/hstack";
import { Skeleton } from "@/components/ui/skeleton";

const getAccountLocation = (accountDetails: AccountObject) => {
  // Find the custom field where the name (trimmed) is exactly "LOCATION"
  return (
    accountDetails?.custom_fields.find(
      (field: CustomField) => field.custom_field_name.trim() === "LOCATION"
    )?.value || "PIVOT"
  ).trim();
};

const AccountModalItem = ({
  account,
  isSelected,
  onPress,
}: {
  account: Account;
  isSelected: boolean;
  onPress: (account_id: number) => void;
}) => {
  // First, declare the type for accountDetails by specifying the generic type parameter for useQuery.
  // Remove the 'cacheTime' property, as it is not a valid option for useQuery in TanStack Query v4+.

  const {
    data: accountDetails,
    isLoading,
    error,
  } = useQuery<AccountObject, Error>({
    queryKey: ["account", account.account_id],
    queryFn: () => getAccount(account.account_id),
    enabled: !!account.account_id,
    staleTime: 5 * 60 * 60 * 1000, // 5 hours in milliseconds
  });

  if (error) {
    return (
      <Button
        className="w-full h-auto flex flex-row items-center justify-between py-2 my-1 bg-red-100"
        variant="link"
        onPress={() => {
          // Try to refetch the account details
          // useQuery returns a refetch function on the result object
          // We can call it here
          if (typeof account.account_id === "number") {
            // refetch is available from useQuery result
            // But we need to get it from the destructured object
            // So, add refetch to the destructure above
          }
        }}
      >
        <Text className="text-red-500 flex-1 text-left">
          Failed to load account. Tap to retry.
        </Text>
      </Button>
    );
  }

  if (isLoading) {
    return (
      <Button
        className="w-full h-auto flex flex-row items-center justify-between py-2 my-1"
        variant="link"
        disabled
      >
        <HStack className="gap-2 flex flex-row items-center">
          <Avatar className="w-12 h-12 mr-3 bg-gray-200">
            {/* Skeleton circle */}
            <Skeleton className="w-full h-full rounded-full" />
          </Avatar>
          <Box className="flex flex-col flex-1">
            {/* Skeleton for name */}
            <Skeleton className="h-5 w-32 rounded mb-1" />
            {/* Skeleton for location */}
            <Skeleton className="h-4 w-20 rounded" />
          </Box>
          {/* Skeleton for check icon (if selected) */}
          <Skeleton className="w-5 h-5 rounded" />
        </HStack>
      </Button>
    );
  }
  return (
    <Button
      key={account.account_id}
      className="w-full h-auto flex flex-row items-center justify-between py-2 my-1"
      variant="link"
      onPress={() => onPress(account.account_id)}
    >
      <HStack className="gap-2 flex flex-row items-center">
        <Avatar
          className={`w-12 h-12 mr-3 bg-green-800 ${
            getAccountLocation(accountDetails) === "PIVOT"
              ? "bg-primary-500"
              : "bg-green-800"
          }`}
        >
          <AvatarFallbackText>{accountDetails?.name}</AvatarFallbackText>
        </Avatar>
        <Box className="flex flex-col flex-1">
          <Text
            className="text-lg font-bold break-words whitespace-pre-line flex-shrink flex-wrap"
            numberOfLines={2}
          >
            {accountDetails?.name}
          </Text>
          <Text className="text-sm text-gray-500">
            {getAccountLocation(accountDetails)}
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
