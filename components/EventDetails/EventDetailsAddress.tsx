import type { DetailItemProps } from "@/types/component";

import { EventDetailsContext } from "@/components/EventDetails/EventDetailsContext";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

import { MapPin } from "lucide-react-native";
import { twMerge } from "tailwind-merge";
import { useContext } from "react";

const Address: React.FC<DetailItemProps> = (props = {}) => {
  const { event } = useContext(EventDetailsContext);
  return (
    <HStack className={twMerge("gap-2 items-center", props.stackClassName)}>
      <Icon
        as={MapPin}
        className={twMerge("text-primary-500", props.iconClassName)}
      />
      <Text className={twMerge(props.textClassName)}>{event?.address}</Text>
    </HStack>
  );
};

export default Address;
