import { AgendaComponentContext } from "@/components/Agenda/context"
import { getDateIdentity } from "@/components/Agenda/helpers"
import { tva } from "@gluestack-ui/utils/nativewind-utils"
import { Text } from "@/components/ui/text"
import { Box } from "@/components/ui/box"

import { useContext, useMemo } from "react"
import { format, isToday } from "date-fns"
import { Pressable } from "react-native"

const dateDetailsBoxStyles = tva({
    base: "bg-white rounded-lg justify-center items-center px-3 py-4 drop-shadow-sm w-full",
    variants: {
        dateIsToday: {
            true: "border border-primary-500",
        },
    },
});

const dateDetailsTextStyles = tva({
    base: "text-xs",
    variants: {
        dateIsToday: {
            true: "text-primary-500",
            false: "text-gray-400",
        },
        size: {
            xs: "text-xs",
            sm: "text-xs",
            md: "text-xs",
            lg: "text-sm",
            xl: "text-base",
            "2xl": "text-lg",
            "3xl": "text-xl",
            "4xl": "text-2xl",
        }
    },
});

const dateDetailsDigitStyles = tva({
    base: "text-lg",
    variants: {
        dateIsToday: {
            true: "text-primary-500",
        },
        size: {
            xs: "text-sm",
            sm: "text-base",
            md: "text-lg",
            lg: "text-xl",
            xl: "text-2xl",
            "2xl": "text-3xl",
            "3xl": "text-4xl",
            "4xl": "text-5xl",
        }
    },
});

export default function AgendaContentItemDateDetails({ date }: AgendaContentItemDateDetailsProps) {
    const { setSelectedDate, styles } = useContext(AgendaComponentContext);
    const dateIsToday = useMemo(() => isToday(date), [getDateIdentity(date)]);
    const handleSelectDate = () => setSelectedDate(date);
    return <Pressable className="w-[48px] flex-col justify-start" onPress={handleSelectDate}>
        <Box className={dateDetailsBoxStyles({ dateIsToday })}>
            <Text className={dateDetailsTextStyles({ size: styles.selectionDateFontSize, dateIsToday })}>{format(date, "EEE")}</Text>
            <Text className={dateDetailsDigitStyles({ size: styles.selectionDateFontSize, dateIsToday })}>{format(date, "dd")}</Text>       
        </Box>
    </Pressable>
}

type AgendaContentItemDateDetailsProps = {
    date: Date
}