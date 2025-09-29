import type { DetailItemProps } from "@/types/component";

import { EventDetailsContext } from "@/components/EventDetails/EventDetailsContext";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

import { UsersRound } from "lucide-react-native";
import { twMerge } from "tailwind-merge";
import { useContext } from "react";

const GuestCount: React.FC<DetailItemProps> = (props = {}) => {
    const { event } = useContext(EventDetailsContext);
    return <HStack className={twMerge("gap-2 items-center", props.stackClassName)}>
        <Icon as={UsersRound} className={twMerge("text-pivot", props.iconClassName)} />
        <Text className={twMerge("text-sm font-semibold", props.textClassName)}>{event?.guests}</Text>
    </HStack>
};

export default GuestCount;