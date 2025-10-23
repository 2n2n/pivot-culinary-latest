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

import { addDays, addWeeks, differenceInWeeks, endOfWeek, format, isAfter, isBefore, isSameDay, isSameMonth, isSameWeek, startOfMonth, startOfWeek, subDays } from "date-fns";
import Animated, { FadeInUp, FadeOutUp, LinearTransition, SharedTransition } from "react-native-reanimated";
import { use, useEffect, useMemo, useRef, useState } from "react";
import { LegendList as FlatList } from "@legendapp/list";
import { Dimensions, Pressable } from "react-native";
import { twMerge } from "tailwind-merge";
import { cssInterop } from "nativewind";

cssInterop(Animated.Text, { className: 'style' });

const CONSTANT_DAYS_IN_WEEK = 7;
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



// TODO: list common ui tokens for the agenda, i.e. colors, fonts, sizes, etc.
// TODO: scrolling on the items should update selectedDate to the current viewed item date
// TODO: update of the selected date should scroll the items to the selected date
// TODO: update of the selected date should update the active week to the selected date's week
// TODO: skeleton ui

export default function AgendaDateSelection() {
    const { selectedDate, setSelectedDate, dateRangeStart, dateRangeEnd, agendaOptions } = use(AgendaComponentContext);
    const [activeWeek, setActiveWeek] = useState<Date>(new Date());
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
        
    const autoScrollToCurrentWeek = () => {
        if (!firstScrollToCurrentWeekIsInitalizedRef.current) {
            agendaSelectionFlatListRef?.current?.scrollToIndex({ index: initialActiveWeekIndex, animated: false });
            firstScrollToCurrentWeekIsInitalizedRef.current = true;
        }
    };
    // Viewable Week refers to the current week visible from the selection
    const autoSelectDayFromViewableWeek = (week: ViewToken<Date>) => {
        if (!week || !firstScrollToCurrentWeekIsInitalizedRef.current) return;
        if (week.index > prevActiveWeekIndexRef.current) setSelectedDate(week.item);
        else setSelectedDate(endOfWeek(week.item, { weekStartsOn: CONSTANTS_WEEKDAYS_MAP[agendaOptions.displayedStartingWeekDay] }));
    }
    const handleViewableWeekChange: NonNullable<OnViewableItemsChanged<Date>> = ({ changed }) => {
        const newViewableWeek = changed.find((item) => item.isViewable);
        if (!newViewableWeek || newViewableWeek.index === prevActiveWeekIndexRef.current) return;
        setActiveWeek(newViewableWeek.item);
        if (agendaSelectionHasBeenDraggedRef.current) autoSelectDayFromViewableWeek(newViewableWeek);
        prevActiveWeekIndexRef.current = newViewableWeek.index;
    };
    useEffect(() => {
        if (!firstScrollToCurrentWeekIsInitalizedRef.current) return;
        const weekIndexFromSelectedDate = weeksRef.current.findIndex(week => isSameWeek(week, selectedDate, { weekStartsOn: CONSTANTS_WEEKDAYS_MAP[agendaOptions.displayedStartingWeekDay] }));
        if (weekIndexFromSelectedDate === -1 || weekIndexFromSelectedDate === prevActiveWeekIndexRef.current) return;
        agendaSelectionFlatListRef.current?.scrollToIndex({ index: weekIndexFromSelectedDate, animated: true });
    }, [getDateIdentity(selectedDate)]);
    return <VStack className="bg-white gap-2 pb-3">
        <AgendaMonthIndicator activeWeek={activeWeek}/>
        <FlatList 
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
            onScrollBeginDrag={() => {
                if (!agendaSelectionHasBeenDraggedRef.current) agendaSelectionHasBeenDraggedRef.current = true;
            }}
            onMomentumScrollEnd={() => {
                if (agendaSelectionHasBeenDraggedRef.current) agendaSelectionHasBeenDraggedRef.current = false;
            }}
            onViewableItemsChanged={handleViewableWeekChange}
            viewabilityConfig={{
                itemVisiblePercentThreshold: 70
            }}
            horizontal
            scrollEventThrottle={500}
        />
    </VStack>
}

const AgendaMonthIndicator = ({ activeWeek }: AgendaMonthIndicatorProps) => {
    const activeMonths = useMemo<[string, string | null]>(() => {
        const activeMonth = format(activeWeek, CONSTANT_MONTH_STRING_FORMAT);
        const endOfActiveWeek = endOfWeek(activeWeek);
        if (isSameMonth(activeWeek, endOfActiveWeek)) return [activeMonth, null];
        else return [activeMonth, format(endOfActiveWeek, CONSTANT_MONTH_STRING_FORMAT)];
    }, [activeWeek]);
    return <VStack className="flex-row justify-between items-center px-4">
        {activeMonths.map((month) => <Animated.Text key={month} layout={LinearTransition} entering={FadeInUp} exiting={FadeOutUp} className="uppercase text-gray-400 text-xs">{month}</Animated.Text>)}
    </VStack>
};

const AgendaWeekItem = ({ date }: AgendaWeekItemProps) => {
    const weekDays = useMemo(() => {
        const weekDays: Array<Date> = [date];
        for (let incrementedDay = 1; incrementedDay < CONSTANT_DAYS_IN_WEEK; incrementedDay++) {
            weekDays.push(addDays(date, incrementedDay));
        }
        return weekDays;
    }, [date]);
    return <HStack className="justify-evenly items-start" style={{ width: Dimensions.get("window").width }}>
        {weekDays.map((weekDay) => <AgendaWeekDayItem key={getDateIdentity(weekDay)} date={weekDay} />)}
    </HStack>
};

cssInterop(Animated.View, { className: 'style' });

const AgendaWeekDayItem = ({ date }: AgendaWeekDayItemProps) => {
    const { selectedDate, setSelectedDate, dateRangeStart, dateRangeEnd, dateSetWithAgendaItems } = use(AgendaComponentContext);
    const isBeyondDateRange = isBefore(date, subDays(dateRangeStart, 1)) || isAfter(date, dateRangeEnd);
    const containsItems = dateSetWithAgendaItems.has(getDateIdentity(date));
    const isSelected = isSameDay(date, selectedDate);
    const isCurrentDay = isSameDay(date, new Date());
    const isFirstDayOfMonth = isSameDay(date, startOfMonth(date));
    const handleDaySelection = () => {
        if (!isBeyondDateRange) setSelectedDate(date);
    }
    return <Pressable onPress={handleDaySelection}>
        <VStack className={twMerge("flex-col items-center justify-center gap-1 my-2", isFirstDayOfMonth && "pl-2 border-l border-gray-300")}>
            <Text className="text-xs text-gray-400 uppercase w-full text-center">
                {format(date, "EEE")}
            </Text>
            <VStack className={agendaWeekDayItemButtonStyle({ isCurrentDay, selected: isSelected })}>
                <Text className={agendaWeekDayItemTextStyle({ selected: isSelected, disabled: isBeyondDateRange})}>
                    {format(date, "dd")}
                </Text>
                <Box className={agendaWeekDayItemDotStyle({ selected: isSelected, active: containsItems })}></Box>
            </VStack>
        </VStack>
    </Pressable>
};

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

const agendaWeekDayItemTextStyle = tva({
    base: "font-medium text-center mt-2 mb-3",
    variants: {
        selected: {
            true: "text-white",
        },
        disabled: {
            true: "text-gray-400",
        },
    },
});

const agendaWeekDayItemDotStyle = tva({
    base: "w-[6px] h-[6px] rounded-full mb-1 bg-primary-500 absolute bottom-[2px] right-1/2 translate-x-1/2",
    variants: {
        selected: {
            true: "bg-white",
        },
        active: {
            true: "block",
            false: "hidden"
        }
    },
    defaultVariants: {
        selected: false,
    },
}); 

type AgendaMonthIndicatorProps = {
    activeWeek: Date,
};



type AgendaWeekItemProps = {
    date: Date,
};

type AgendaWeekDayItemProps = {
    date: Date,
};

