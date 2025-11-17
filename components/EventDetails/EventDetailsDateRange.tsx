import type { DetailItemProps } from "@/types/component";
import type React from "react";

import { EventDetailsContext } from "@/components/EventDetails/EventDetailsContext";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

import { useCallback, useContext, useMemo } from "react";
import { CalendarDays } from "lucide-react-native";
import { format, isSameDay } from "date-fns";
import { twMerge } from "tailwind-merge";

type DateRangeProps = {
  formatter?: (date: Date) => string;
} & DetailItemProps;

const EventDetailsDateRange: React.FC<DateRangeProps> = (props = {}) => {
  const { event } = useContext(EventDetailsContext);
  const dateFormatter = useCallback(
    props.formatter || ((date: Date) => format(date, "MMM d, yyyy")),
    [props.formatter]
  );
  const formattedStartDate = useMemo(() => {
    if (!event?.startDate) return null;
    return dateFormatter(event?.startDate);
  }, [event?.startDate, dateFormatter]);
  const formattedEndDate = useMemo(() => {
    if (!event?.endDate) return null;
    return dateFormatter(event?.endDate);
  }, [event?.endDate, dateFormatter]);
  const sameDay = useMemo(() => {
    if (!event?.startDate || !event?.endDate) return false;
    return isSameDay(event.startDate, event.endDate);
  }, [event?.startDate, event?.endDate]);
  if (!formattedStartDate && !formattedEndDate) return null;
  if (sameDay || !formattedEndDate)
    return (
      <HStack className={twMerge("gap-2 items-center", props.stackClassName)}>
        <Icon
          as={CalendarDays}
          className={twMerge("text-primary-500", props.iconClassName)}
        />
        <Text className={twMerge(props.textClassName)}>
          {formattedStartDate}
        </Text>
      </HStack>
    );
  return (
    <HStack className={twMerge("gap-2 items-center", props.stackClassName)}>
      <Icon
        as={CalendarDays}
        className={twMerge("text-primary-500", props.iconClassName)}
      />
      <Text className={twMerge(props.textClassName)}>
        {formattedStartDate} - {formattedEndDate}
      </Text>
    </HStack>
  );
};

export default EventDetailsDateRange;
