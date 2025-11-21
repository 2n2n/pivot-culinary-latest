import { Phone, MessageSquareMore } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { twMerge } from "tailwind-merge";
import React from "react";
import { Linking } from "react-native";

const AccountManagerContact: React.FC<{ manager: Contact, textClassName?: string, buttonClassName?: string }> = ({ manager, textClassName, buttonClassName }) => {
  return (
    <HStack className="items-center justify-between py-1 px-4">
      <HStack className="items-center gap-3 flex-1">
        <Avatar size="lg">
          <AvatarImage
            source={require("@/assets/images/fallback-profile.jpg")}
            alt={manager.first_name + " " + manager.last_name}
          />
        </Avatar>
        <VStack className="flex-1">
          <Text className={twMerge("text-white text-lg font-semibold", textClassName)}>
            {manager.first_name + " " + manager.last_name}
          </Text>
          <Text className={twMerge("text-white/80 text-sm", textClassName)}>
            {manager?.title || "Account Manager"}
          </Text>
        </VStack>
      </HStack>

      <HStack className="gap-4">
        {(manager?.phone_numbers?.length || 0) > 0 && (
          <>
            <Button
              onPress={() => {
                Linking.openURL(`tel:${manager.phone_numbers?.[0].number}`);
              }}
              size="sm"
              className={twMerge("w-12 h-12 rounded-full bg-background-transparent border border-white", buttonClassName)}
            >
              <Icon className={twMerge("text-white", textClassName)} as={Phone} />
            </Button>
            <Button
              onPress={() => {
                if (manager?.phone_numbers?.[0]?.number) {
                  Linking.openURL(`sms:${manager.phone_numbers[0].number}`);
                }
              }}
              size="sm"
              className={twMerge("w-12 h-12 rounded-full bg-background-transparent border border-white", buttonClassName)}
            >
              <Icon className={twMerge("text-white", textClassName)} as={MessageSquareMore} />
            </Button>
          </>
        )}
      </HStack>
    </HStack>
  );
};

export default AccountManagerContact;
