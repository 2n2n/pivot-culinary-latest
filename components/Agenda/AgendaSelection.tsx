import type { LegendListRef, OnViewableItemsChanged, ViewToken } from "@legendapp/list";
import type { WeekDayString } from "@/components/Agenda/types";
import type { Day } from "date-fns";
import type React from "react";

import { AgendaComponentContext } from "@/components/Agenda/context";
import { getDateIdentity } from "@/components/Agenda/helpers";
import { tva } from "@gluestack-ui/utils/nativewind-utils";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";

import { addDays, addWeeks, differenceInWeeks, endOfWeek, format, isAfter, isBefore, isSameDay, isSameWeek, startOfMonth, startOfWeek, subDays } from "date-fns";
import { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { LegendList as FlatList } from "@legendapp/list";
import { Dimensions, Pressable } from "react-native";

const CONSTANT_DAYS_IN_WEEK = 7;
const CONSTANTS_WEEKDAYS_MAP: Record<WeekDayString, Day> = {
    "sunday": 0,
    "monday": 1,
    "tuesday": 2,
    "wednesday": 3,
    "thursday": 4,
    "friday": 5,
    "saturday": 6,
}

export default function AgendaDateSelection() {
    const { selectedDate, setSelectedDate, dateRangeStart, dateRangeEnd, agendaOptions } = useContext(AgendaComponentContext);
    const agendaSelectionFlatListRef = useRef<LegendListRef>(null);
    const agendaSelectionHasBeenDraggedRef = useRef(false);
    const firstScrollToCurrentWeekIsInitalizedRef = useRef(false);
    const prevActiveWeekIndexRef = useRef<number>(0);
    const weeksRef = useRef<Array<Date>>([]);
    const { weeks, initialActiveWeekIndex } = useMemo(() => {
        const weekDayStartOfDateRangeStart = startOfWeek(dateRangeStart, { weekStartsOn: CONSTANTS_WEEKDAYS_MAP[agendaOptions.displayedStartingWeekDay] });
        // prematurely insert the first week, will save time
        const updatedWeeks: Array<Date> = [weekDayStartOfDateRangeStart]; 
        const maxNumberOfWeeks = differenceInWeeks(dateRangeEnd, dateRangeStart, { roundingMethod: "round" });
        for (let incrementedWeek = 1; incrementedWeek <= maxNumberOfWeeks; incrementedWeek++) {
            updatedWeeks.push(addWeeks(updatedWeeks[incrementedWeek - 1], 1));
        }
        const updatedInitialUpdatedWeeks = Math.max(0, updatedWeeks.findIndex(week => isSameWeek(week, new Date(), { weekStartsOn: CONSTANTS_WEEKDAYS_MAP[agendaOptions.displayedStartingWeekDay] })));
        prevActiveWeekIndexRef.current = updatedInitialUpdatedWeeks;
        weeksRef.current = updatedWeeks;
        return {
            weeks: updatedWeeks,
            initialActiveWeekIndex: updatedInitialUpdatedWeeks
        };
        // using getDateIdentity with react's dependency array ensures
        // consistent recalculation regardless what instance of Date 
        // the dateRangeStart and dateRangeEnd is
    }, [getDateIdentity(dateRangeStart), getDateIdentity(dateRangeEnd), agendaOptions.displayedStartingWeekDay]);
    const autoScrollToCurrentWeek = useCallback(() => {
        if (!firstScrollToCurrentWeekIsInitalizedRef.current) {
            agendaSelectionFlatListRef?.current?.scrollToIndex({ index: initialActiveWeekIndex, animated: false });
            firstScrollToCurrentWeekIsInitalizedRef.current = true;
        }
    }, [initialActiveWeekIndex]);
    // Viewable Week refers to the current week visible from the selection
    const autoSelectDayFromViewableWeek = useCallback((week: ViewToken<Date>) => {
        if (!week || !firstScrollToCurrentWeekIsInitalizedRef.current) return;
        if (week.index > prevActiveWeekIndexRef.current) setSelectedDate(week.item);
        else setSelectedDate(endOfWeek(week.item, { weekStartsOn: CONSTANTS_WEEKDAYS_MAP[agendaOptions.displayedStartingWeekDay] }));
    }, [agendaOptions.displayedStartingWeekDay]);
    const handleViewableWeekChange: NonNullable<OnViewableItemsChanged<Date>> = useCallback(({ changed }) => {
        const newViewableWeek = changed.find((item) => item.isViewable);
        if (!newViewableWeek || newViewableWeek.index === prevActiveWeekIndexRef.current) return;
        if (agendaSelectionHasBeenDraggedRef.current) autoSelectDayFromViewableWeek(newViewableWeek);
        prevActiveWeekIndexRef.current = newViewableWeek.index;
    }, [autoSelectDayFromViewableWeek]);
    useEffect(() => {
        if (!firstScrollToCurrentWeekIsInitalizedRef.current) return;
        const weekIndexFromSelectedDate = weeksRef.current.findIndex(week => isSameWeek(week, selectedDate, { weekStartsOn: CONSTANTS_WEEKDAYS_MAP[agendaOptions.displayedStartingWeekDay] }));
        if (weekIndexFromSelectedDate === -1 || weekIndexFromSelectedDate === prevActiveWeekIndexRef.current) return;
        agendaSelectionFlatListRef.current?.scrollToIndex({ index: weekIndexFromSelectedDate, animated: true });
    }, [getDateIdentity(selectedDate)]);
    return <FlatList 
        ref={agendaSelectionFlatListRef}
        data={weeks}
        renderItem={({ item }) => <AgendaWeekItem date={item} />}
        snapToAlignment="start"
        snapToInterval={Dimensions.get("window").width}
        decelerationRate="fast"
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => getDateIdentity(item)}
        onLayout={autoScrollToCurrentWeek}
        onScrollBeginDrag={() => agendaSelectionHasBeenDraggedRef.current = true}
        onMomentumScrollEnd={() => agendaSelectionHasBeenDraggedRef.current = false}
        onViewableItemsChanged={handleViewableWeekChange}
        viewabilityConfig={{
            itemVisiblePercentThreshold: 70
        }}
        horizontal
        scrollEventThrottle={500}
    />
}

const agendaWeekItemStyles = tva({
    base: "justify-evenly items-start",
    variants: {
        padding: {
            sm: 'px-2',
            md: 'px-4',
            lg: 'px-6'
        },
        space: {
            sm: "justify-center gap-2",
            md: "justify-center gap-4",
            lg: "justify-center gap-6",
            even: "justify-evenly",
        }
    },
    defaultVariants: {
        padding: "md",
        space: "even",
    }
});

const AgendaWeekItem = ({ date }: AgendaWeekItemProps) => {
    const { styles } = useContext(AgendaComponentContext);
    const weekDays = useMemo(() => {
        const weekDays: Array<Date> = [date];
        for (let incrementedDay = 1; incrementedDay < CONSTANT_DAYS_IN_WEEK; incrementedDay++) {
            weekDays.push(addDays(date, incrementedDay));
        }
        return weekDays;
    }, [date]);
    return <HStack className={agendaWeekItemStyles({ padding: styles.paddingHorizontal || "sm", space: styles.dateSelectionSpacing })} style={{ width: Dimensions.get("window").width }}>
        {weekDays.map((weekDay) => <AgendaWeekDayItem key={getDateIdentity(weekDay)} date={weekDay} />)}
    </HStack>
};

const agendaWeekDayItemContainerStyles = tva({
    base: "flex-col items-center justify-center gap-1 my-2",
    variants: {
        isFirstDayOfMonth: {
            true: "pl-2 border-l border-gray-300",
        },
    },
});

const agendaWeekDayItemTextStyles = tva({
    base: "text-xs text-gray-400 uppercase w-full text-center",
    variants: {
        fontCase: {
            uppercase: "uppercase",
            lowercase: "lowercase",
            capitalize: "capitalize",
        },
        fontWeight: {
            light: "font-light",
            normal: "font-normal",
            bold: "font-bold",
            extrablack: "font-extrablack",
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

const agendaWeekDayItemButtonStyle = tva({
    base: "relative aspect-square items-center justify-center rounded-full border",
    variants: {
        selected: {
            true: "bg-primary-500",
            false: "bg-transparent",
        },
        isCurrentDay: {
            true: "border-primary-500",
            false: "border-transparent",
        },
    },
});

const agendaWeekDayItemDigitStyles = tva({
    base: "font-medium text-center mt-2 mb-3",
    variants: {
        selected: {
            true: "text-white",
        },
        disabled: {
            true: "text-gray-400",
        },
        fontWeight: {
            light: "font-light",
            normal: "font-medium",
            bold: "font-bold",
            extrablack: "font-extrablack",
        },
        size: {
            xs: "text-sm",
            sm: "text-md",
            md: "text-base",
            lg: "text-lg",
            xl: "text-xl",
            "2xl": "text-2xl",
            "3xl": "text-3xl",
            "4xl": "text-4xl",
        }
    },
});

const agendaWeekDayItemDotStyle = tva({
    base: "w-[6px] h-[6px] rounded-full mb-1 bg-primary-500 absolute bottom-[1.75px] right-1/2 translate-x-1/2",
    variants: {
        selected: {
            true: "bg-white",
        },
        active: {
            true: "block",
            false: "hidden"
        },
        fontSizeAdjustment: {
            xs: "bottom-[2px]",
            sm: "bottom-[1.75px]",
            md: "bottom-[1.5px]",
            lg: "bottom-[1.5px]",
            xl: "bottom-[1px]",
            "2xl": "bottom-[0.5px]",
        }
    },
    defaultVariants: {
        selected: false,
    },
}); 

const AgendaWeekDayItem = ({ date }: AgendaWeekDayItemProps) => {
    const { selectedDate, setSelectedDate, dateRangeStart, dateRangeEnd, dateSetWithAgendaItems, styles } = useContext(AgendaComponentContext);
    const dateItemIdentity = getDateIdentity(date);
    const selectedDateIdentity = getDateIdentity(selectedDate);
    const isBeyondDateRange = useMemo(() => isBefore(date, subDays(dateRangeStart, 1)) || isAfter(date, dateRangeEnd), [dateItemIdentity, getDateIdentity(dateRangeStart), getDateIdentity(dateRangeEnd)]);
    const containsItems = useMemo(() => dateSetWithAgendaItems.has(dateItemIdentity), [dateItemIdentity, dateSetWithAgendaItems]);
    const isSelected = useMemo(() => isSameDay(date, selectedDate), [dateItemIdentity, selectedDateIdentity]);
    const isCurrentDay = useMemo(() => isSameDay(date, new Date()), [dateItemIdentity]);
    const isFirstDayOfMonth = useMemo(() => isSameDay(date, startOfMonth(date)), [dateItemIdentity]);
    const handleDaySelection = useCallback(() => {
        if (!isBeyondDateRange) setSelectedDate(date);
    }, [isBeyondDateRange, getDateIdentity(date)]);
    return <Pressable onPress={handleDaySelection}>
        <VStack className={agendaWeekDayItemContainerStyles({ isFirstDayOfMonth })}>
            <Text className={agendaWeekDayItemTextStyles({ size: styles.selectionDateFontSize, fontCase: styles.selectionDateFontCase, fontWeight: styles.selectionDateFontWeight })}>
                {format(date, "EEE")}
            </Text>
            <VStack className={agendaWeekDayItemButtonStyle({ isCurrentDay, selected: isSelected })}>
                <Text className={agendaWeekDayItemDigitStyles({ selected: isSelected, disabled: isBeyondDateRange, fontWeight: styles.selectionDateFontWeight, size: styles.selectionDateFontSize })}>
                    {format(date, "dd")}
                </Text>
                <Box className={agendaWeekDayItemDotStyle({ selected: isSelected, active: containsItems, fontSizeAdjustment: styles.selectionDateFontSize })}></Box>
            </VStack>
        </VStack>
    </Pressable>
};

type AgendaWeekItemProps = {
    date: Date,
};

type AgendaWeekDayItemProps = {
    date: Date,
};

