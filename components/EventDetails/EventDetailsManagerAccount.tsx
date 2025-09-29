import type React from "react";

import { Avatar, AvatarFallbackText, AvatarImage } from "@/components/ui/avatar";
import { EventDetailsContext } from "@/components/EventDetails/EventDetailsContext";
import { Button, ButtonIcon } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";

import { MessageSquareMore, Phone } from "lucide-react-native";
import { twMerge } from "tailwind-merge";
import { useContext } from "react";
import { Linking } from "react-native";

type EventDetailsManagerAccountProps = {
    className?: string;
    avatarClassName?: string;
    buttonClassName?: string;
}

const EventDetailsManagerAccount: React.FC<EventDetailsManagerAccountProps> = (props = {}) => {
    const { event } = useContext(EventDetailsContext);
    if (!event?.managerAccount) return null;
    const handleContactPhone = () => {
        if (!event.managerAccount?.phone) return;
        Linking.openURL(`tel:${event.managerAccount?.phone}`);
    };
    const handleContactMessage = () => {
        if (!event.managerAccount?.phone) return;
        Linking.openURL(`sms:${event.managerAccount?.phone}`);
    };
    return <HStack className={twMerge("gap-2 items-center justify-between", props.className)}>
        <HStack className="gap-3 items-center">
            <Avatar className={twMerge(props.avatarClassName)}>
                <AvatarFallbackText>{event.managerAccount.name.charAt(0)}</AvatarFallbackText>
                <AvatarImage source={{ uri: event.managerAccount.image }} />
            </Avatar>
            <VStack>   
                <Text className="text-sm font-semibold">{event.managerAccount.name}</Text>
                <Text className="text-xs text-gray-500">{event.managerAccount.role}</Text>
            </VStack>
        </HStack>
        <HStack className="gap-2 items-center">
            <Button 
                variant="outline" 
                size="sm" 
                className={twMerge("!p-4 w-10 h-10 rounded-full", props.buttonClassName)} 
                onPress={handleContactPhone}
            >
                <ButtonIcon as={Phone} />
            </Button>
            <Button 
                variant="outline" 
                size="sm" 
                className={twMerge("!p-4 w-10 h-10 rounded-full", props.buttonClassName)} 
                onPress={handleContactMessage}
            >
                <ButtonIcon as={MessageSquareMore} />
            </Button>
        </HStack>
    </HStack>
};

export default EventDetailsManagerAccount;