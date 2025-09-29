import type { TextProps } from "@/types/component";

import { EventDetailsContext } from "@/components/EventDetails/EventDetailsContext";
import { Text } from "@/components/ui/text";

import { twMerge } from "tailwind-merge";
import { useContext } from "react";

const EventDetailsTimeRange: React.FC<TextProps> = (props = {}) => {
    const { event } = useContext(EventDetailsContext);
    return <Text 
        numberOfLines={1} 
        {...props} 
        className={twMerge("font-semibold", props.className)}
    >{event?.startTime} - {event?.endTime}</Text>
};

export default EventDetailsTimeRange;