import type { WeekDayString } from "@/components/Agenda/types";
import type { AnimatedStyle } from "react-native-reanimated";
import { StyleSheet, type StyleProp, type TextStyle } from "react-native";
import type { Day } from "date-fns";
import type React from "react";

import { AgendaComponentContext } from "@/components/Agenda/context";
import { getDateIdentity } from "@/components/Agenda/helpers";
import { tva } from "@gluestack-ui/utils/nativewind-utils";
import { VStack } from "@/components/ui/vstack";
import { Box } from "@/components/ui/box";

import Animated, { FadeInUp, FadeOutUp, LinearTransition } from "react-native-reanimated";
import { endOfWeek, format, isSameMonth, isSameYear, startOfWeek } from "date-fns";
import { useContext, useMemo } from "react";

const CONSTANT_MONTH_STRING_FORMAT = "MMMM";
const CONSTANTS_WEEKDAYS_MAP: Record<WeekDayString, Day> = {
    "sunday": 0,
    "monday": 1,
    "tuesday": 2,
    "wednesday": 3,
    "thursday": 4,
    "friday": 5,
    "saturday": 6,
}

export default function AgendaMonthIndicator({ activeWeek }: AgendaMonthIndicatorProps) {
    const { styles, agendaOptions } = useContext(AgendaComponentContext);
    const activeMonth = useMemo(() => startOfWeek(activeWeek, { weekStartsOn: CONSTANTS_WEEKDAYS_MAP[agendaOptions.displayedStartingWeekDay] }), [getDateIdentity(activeWeek)]);
    const endOfActiveWeek = useMemo(() => endOfWeek(activeWeek, { weekStartsOn: CONSTANTS_WEEKDAYS_MAP[agendaOptions.displayedStartingWeekDay] }), [getDateIdentity(activeWeek)]);
    const activeYear = useMemo(() => {
        if (isSameYear(activeMonth, endOfActiveWeek)) return format(activeMonth, "yyyy");
        else return `${format(activeMonth, "yyyy")} - ${format(endOfActiveWeek, "yyyy")}`;
    }, [getDateIdentity(activeMonth), getDateIdentity(endOfActiveWeek)]);
    const indicators = useMemo<[string, string, string | null]>(() => {
        if (isSameMonth(activeMonth, endOfActiveWeek)) return [format(activeMonth, CONSTANT_MONTH_STRING_FORMAT), activeYear, null];
        else return [format(activeMonth, CONSTANT_MONTH_STRING_FORMAT), activeYear, format(endOfActiveWeek, CONSTANT_MONTH_STRING_FORMAT)];
    }, [getDateIdentity(activeMonth), activeYear, getDateIdentity(endOfActiveWeek)]);
    return <VStack className={agendaMonthIndicatorStyles({ padding: styles.paddingHorizontal })}>
        {indicators.map((indicator, index) => (indicator ?<Animated.Text 
                key={indicator} 
                layout={LinearTransition} 
                entering={FadeInUp} 
                exiting={FadeOutUp} 
                style={
                    [
                        agendaMonthIndicatorTextBaseStyle,
                        {
                            textAlign: index === 0 ? "left" : index === 1 ? "center" : "right",
                            flex: index === 1 ? 1 : 0,
                            fontSize: fontSizeMap[styles?.selectionDateFontSize || "md"] || 12,
                            fontWeight: fontWeightMap[styles?.selectionDateFontWeight || "normal"] || "400",
                            textTransform: fontCaseMap[styles?.selectionDateFontCase || "uppercase"] || "uppercase",
                        } as any
                    ]
                }
            >
                {indicator}
            </Animated.Text> : <Box key="empty-indicator" className="min-w-[75px] text-gray-400"/>)
        )}
    </VStack>
};

const agendaMonthIndicatorStyles = tva({
    base: "flex-row justify-center items-center px-4",
    variants: {
        padding: {
            sm: 'px-2',
            md: 'px-4',
            lg: 'px-6'
        }
    },
});

const agendaMonthIndicatorTextBaseStyle: StyleProp<AnimatedStyle<StyleProp<TextStyle>>> = {
    color: "#9ca3af",
    minWidth: 75
}

const fontCaseMap = {
    uppercase: "uppercase",
    lowercase: "lowercase",
    capitalize: "capitalize",
};


const fontWeightMap = {
    light: 300,
    normal: 400,
    bold: 700,
    extrablack: 900,
};

const fontSizeMap = {
    xs: 12,
    sm: 12,
    md: 12,
    lg: 14,
    xl: 16,
    "2xl": 18,
    "3xl": 20,
    "4xl": 24,
}

type AgendaMonthIndicatorProps = {
    activeWeek: Date,
};