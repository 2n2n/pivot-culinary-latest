import type { DetailItemProps } from "@/types/component";

import { EventDetailsContext } from "@/components/EventDetails/EventDetailsContext";
import { BadgeText } from "@/components/ui/badge";
import { HStack } from "@/components/ui/hstack";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { useContext } from "react";
import { twMerge } from "tailwind-merge";

type FinancialDetailsProps = {
    badgeClassName?: string,
    badgeTextClassName?: string,
} & Omit<DetailItemProps, "iconProps">

const Financial: React.FC<FinancialDetailsProps> = (props = {}) => {
    const { event, showFinance } = useContext(EventDetailsContext);
    if (!showFinance) return null;
    return <HStack className={twMerge("gap-3", props.stackClassName)}>
        <Text className={twMerge("font-semibold", props.textClassName)}>{event?.amount}</Text>
        <Badge action="success" className={twMerge(props.badgeClassName)}>
            <BadgeText action="success" className={twMerge(props.badgeTextClassName)}>{event?.status}</BadgeText>
        </Badge>
    </HStack>
};

export default Financial;