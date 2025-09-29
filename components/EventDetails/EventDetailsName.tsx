import type { TextProps } from "@/types/component";

import { EventDetailsContext } from "@/components/EventDetails/EventDetailsContext";
import { Text } from "@/components/ui/text";

import { twMerge } from "tailwind-merge";
import { useContext } from "react";

const EventDetailsName: React.FC<TextProps> = (props = {}) => {
    const { event } = useContext(EventDetailsContext);
    return <Text {...props} className={twMerge(props.className)}>{event?.name}</Text>
}

export default EventDetailsName;