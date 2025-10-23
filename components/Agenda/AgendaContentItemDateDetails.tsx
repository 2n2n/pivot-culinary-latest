import { AgendaComponentContext } from "@/components/Agenda/context"
import { Text } from "@/components/ui/text"
import { Box } from "@/components/ui/box"

import { format, isToday } from "date-fns"
import { Pressable } from "react-native"
import { twMerge } from "tailwind-merge"
import { use } from "react"

export default function AgendaContentItemDateDetails({ date }: AgendaContentItemDateDetailsProps) {
    const { setSelectedDate } = use(AgendaComponentContext);
    const handleSelectDate = () => setSelectedDate(date);
    return <Pressable className="w-[48px] flex-col justify-start" onPress={handleSelectDate}>
        <Box className={
            twMerge(
                "bg-white rounded-lg justify-center items-center px-3 py-4 drop-shadow-sm w-full",
                isToday(date) && "border border-primary-500",
            )
        }>
            <Text className={
                twMerge(
                    "text-xs",
                    isToday(date) && "text-primary-500",
                )  
            }>{format(date, "EEE")}</Text>
            <Text className={
                twMerge(
                    "text-lg",
                    isToday(date) && "text-primary-500",
                )
            }>{format(date, "dd")}</Text>       
        </Box>
    </Pressable>
}

type AgendaContentItemDateDetailsProps = {
    date: Date
}