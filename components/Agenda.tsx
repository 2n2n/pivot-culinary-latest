import type { LegendListRef, OnViewableItemsChanged, ViewToken } from "@legendapp/list";
import type { Day } from "date-fns";
import type React from "react";

import { tva } from "@gluestack-ui/utils/nativewind-utils";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";

import { addDays, addWeeks, differenceInDays, differenceInWeeks, endOfWeek, format, isAfter, isBefore, isSameDay, isSameMonth, isSameWeek, max, min, startOfDay, startOfMonth, startOfWeek, subDays, subHours, toDate } from "date-fns";
import Animated, { FadeInUp, FadeOutUp, LinearTransition } from "react-native-reanimated";
import { LegendList as FlatList } from "@legendapp/list";
import { Dimensions, Pressable } from "react-native";
import { createContext, Dispatch, SetStateAction, use, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { cssInterop } from "nativewind";
import { Center } from "@/components/ui/center";

cssInterop(Animated.Text, { className: 'style' });

const CONSTANT_DAYS_IN_WEEK = 7;
const CONSTANT_DATE_STRING_FORMAT = "MM/dd/yyyy";
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
const DEFAULT_STARTING_WEEK_DAY = "monday";
const DEFAULT_INITIAL_SELECTED_DATE = startOfDay(new Date());
const DEFAULT_DATE_RANGE_START = subDays(DEFAULT_INITIAL_SELECTED_DATE, 7);
const DEFAULT_DATE_RANGE_END = addDays(DEFAULT_INITIAL_SELECTED_DATE, 7);

const getDateIdentity = (date: Date) => format(date, CONSTANT_DATE_STRING_FORMAT);

const AgendaComponentContext = createContext<AgendaComponentContextType>({
    selectedDate: DEFAULT_INITIAL_SELECTED_DATE,
    setSelectedDate: () => {},
    activeWeek: new Date(),
    setActiveWeek: () => {},
    dateSetWithAgendaItems: new Set(),
    dateRangeStart: DEFAULT_DATE_RANGE_START,
    dateRangeEnd: DEFAULT_DATE_RANGE_END,
    agendaOptions: {
        displayedStartingWeekDay: DEFAULT_STARTING_WEEK_DAY,
    },
});

const getSafeDateRangeStart = (items: Array<AgendaItem<any>>, dateRangeStart: Date) => {
    return items.length ? min([dateRangeStart, items[0].date]) : dateRangeStart;
}
const getSafeDateRangeEnd = (items: Array<AgendaItem<any>>, dateRangeEnd: Date) => {
    return max(items.length ? [dateRangeEnd, items[items.length - 1].date, new Date()] : [dateRangeEnd, new Date()]);
}

// TODO: list common ui tokens for the agenda, i.e. colors, fonts, sizes, etc.
// TODO: scrolling on the items should update selectedDate to the current viewed item date
// TODO: update of the selected date should scroll the items to the selected date
// TODO: update of the selected date should update the active week to the selected date's week
// TODO: skeleton ui
export default function Agenda<T extends any>(
    { 
        items, 
        isLoading = false,
        isRefreshing = false,
        onRefresh = () => {},
        renderItem, 
        dateRangeStart = DEFAULT_DATE_RANGE_START, // 
        dateRangeEnd = DEFAULT_DATE_RANGE_END,
        initialSelectedDate = DEFAULT_INITIAL_SELECTED_DATE,
        options = {
            displayedStartingWeekDay: DEFAULT_STARTING_WEEK_DAY,
        }
    }: AgendaProps<T>
) {
    const [selectedDate, setSelectedDate] = useState<Date>(initialSelectedDate);
    const [activeWeek, setActiveWeek] = useState<Date>(new Date());
    // this is used as a super quick lookup for which dates have an actual event/agenda items
    const dateSetWithAgendaItems = useMemo(() => {
        const updatedDateSet: Set<string> = new Set();
        for (let i = 0; i < items.length; i++) {
            const itemDate = items[i].date;
            updatedDateSet.add(getDateIdentity(itemDate));
        }
        return updatedDateSet;
    }, [items]);
    const itemsWithFilledGaps = useMemo(() => {
        if (items.length === 0) return items;
        const startDate = items[0].date;
        const endDate = items[items.length - 1].date;
        if (isSameDay(startDate, endDate)) return items;
        const updatedItemsWithFilledGaps: Array<AgendaItem<T>> = [];
        const maxNumberOfDays = differenceInDays(endDate, startDate);
        for (let i = 0; i < maxNumberOfDays; i++) {
            const currentDate = addDays(startDate, i);
            const itemGroup = items.find((item) => isSameDay(item.date, currentDate));
            if (itemGroup) updatedItemsWithFilledGaps.push(itemGroup);
            else updatedItemsWithFilledGaps.push({ date: currentDate, items: [] });
        }
        return updatedItemsWithFilledGaps;
    }, [items]);
    // ensures that when the items that are beyond the date range are still selectable
    const safeDateRangeStart = getSafeDateRangeStart(items, dateRangeStart);
    // ensures that the date range is acceptable and respects the items and today's date
    const safeDateRangeEnd = getSafeDateRangeEnd(items, dateRangeEnd);
    return <AgendaComponentContext.Provider value={{
        selectedDate,
        setSelectedDate,
        activeWeek,
        setActiveWeek,
        dateSetWithAgendaItems,
        dateRangeStart: safeDateRangeStart,
        dateRangeEnd: safeDateRangeEnd,
        agendaOptions: options,
    }}>
        <VStack className="flex-1 bg-[#F5F5F5]">
            <AgendaWeekAndDaySelection />
            <FlatList
                data={itemsWithFilledGaps}
                keyExtractor={(item) => getDateIdentity(item.date)}
                renderItem={({ item: itemGroup }) => <HStack className="w-full gap-2 px-4">
                    <VStack className="w-[48px]">
                        <Box className="bg-white rounded-lg justify-center items-center px-3 py-4 drop-shadow-sm w-full">
                            <Text className="text-xs">{format(itemGroup.date, "EEE")}</Text>
                            <Text className="text-lg">{format(itemGroup.date, "dd")}</Text>
                        </Box>
                    </VStack>
                    {
                        itemGroup.items.length ? <FlatList 
                        data={itemGroup.items}
                        renderItem={({ item, index }) => renderItem?.(item, itemGroup.date, index)}
                        ItemSeparatorComponent={() => <Box className="h-2" />}
                    /> : <Center className="flex-1 border border-dashed rounded-lg h-full border-gray-400">
                    <Text>No activity on this day</Text>
                </Center>}
                </HStack>}
                ItemSeparatorComponent={() => <Box className="w-[calc(100%-32px)] h-[1px] bg-slate-300 my-6 mx-4" />}
                contentContainerClassName="py-4"
                className="flex-1"
            />
        </VStack>
    </AgendaComponentContext.Provider>
};

const AgendaWeekAndDaySelection = () => {
    const { setSelectedDate, dateRangeStart, dateRangeEnd, agendaOptions } = use(AgendaComponentContext);
    const [activeWeek, setActiveWeek] = useState<Date>(new Date());
    const agendaSelectionFlatListRef = useRef<LegendListRef>(null);
    const firstScrollToCurrentWeekIsInitalizedRef = useRef(false); // java dev be like
    const prevActiveWeekIndexRef = useRef<number>(0);
    const { weeks, initialActiveWeekIndex } = useMemo(() => {
        const weekDayStartOfDateRangeStart = startOfWeek(dateRangeStart, { weekStartsOn: CONSTANTS_WEEKDAYS_MAP[agendaOptions.displayedStartingWeekDay] });
        // prematurely insert the first week, will save time
        const updatedWeeks: Array<Date> = [weekDayStartOfDateRangeStart]; 
        const maxNumberOfWeeks = differenceInWeeks(dateRangeEnd, dateRangeStart);
        for (let incrementedWeek = 1; incrementedWeek <= maxNumberOfWeeks; incrementedWeek++) {
            updatedWeeks.push(addWeeks(updatedWeeks[incrementedWeek - 1], 1));
        }
        const updatedInitialUpdatedWeeks = Math.max(0, updatedWeeks.findIndex(week => isSameWeek(week, new Date())));
        prevActiveWeekIndexRef.current = updatedInitialUpdatedWeeks;
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
        if (!firstScrollToCurrentWeekIsInitalizedRef.current || !setSelectedDate) return;
        if (week.index > prevActiveWeekIndexRef.current) setSelectedDate(week.item);
        else setSelectedDate(endOfWeek(week.item, { weekStartsOn: CONSTANTS_WEEKDAYS_MAP[agendaOptions.displayedStartingWeekDay] }));
        prevActiveWeekIndexRef.current = week.index;
    }
    const handleViewableWeekChange: NonNullable<OnViewableItemsChanged<Date>> = ({ changed }) => {
        const newViewableWeek = changed.find((item) => item.isViewable);
        if (!newViewableWeek || newViewableWeek.index === prevActiveWeekIndexRef.current) return;
        setActiveWeek(newViewableWeek.item);
        autoSelectDayFromViewableWeek(newViewableWeek);
    };
    // ! TODO: Fix issue where week selection is not updated when the selected date is updated outside of the AgendaWeekAndDaySelection
    // useEffect(() => {
    //     if (!ref.current || (prevSelectedDate.current && isSameDay(prevSelectedDate.current, selectedDate))) return;
    //     prevSelectedDate.current = selectedDate;
    //     console.log("🚀 ~ AgendaWeekAndDaySelection ~ selectedDate:", selectedDate)
    //     let matchingWeekIndex: number = -1; // -1 for not found
    //     for(let weekIndex = 0; weekIndex < weeks.length; weekIndex++) {
    //         if (!isSameWeek(weeks[weekIndex], selectedDate, { weekStartsOn: CONSTANTS_WEEKDAYS_MAP[displayedStartingWeekDay] })) continue;
    //         matchingWeekIndex = weekIndex;
    //     };
    //     if (isBefore(selectedDate, weeks[0] /* first week */)) matchingWeekIndex = 0;
    //     else if (isAfter(selectedDate, weeks[weeks.length - 1] /* last week */)) matchingWeekIndex = weeks.length - 1;
    //     if (matchingWeekIndex === -1) return;
    //     ref.current.scrollToIndex({
    //         index: matchingWeekIndex,
    //         animated: initializedScrollToCurrentWeek?.current
    //     });
    //     if(!initializedScrollToCurrentWeek.current) initializedScrollToCurrentWeek.current = true;
    // }, [selectedDate, weeks]);
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
            onViewableItemsChanged={handleViewableWeekChange}
            viewabilityConfig={{
                itemVisiblePercentThreshold: 90
            }}
            horizontal
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

const agendaWeekDayItemButtonStyle = tva({
    base: "relative aspect-square items-center justify-center rounded-full border",
    variants: {
        selected: {
            true: "bg-primary-500",
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

type AgendaOptions = {
    displayedStartingWeekDay: WeekDayString,
};

type AgendaComponentContextType = {
    selectedDate: Date,
    setSelectedDate: Dispatch<SetStateAction<AgendaComponentContextType["selectedDate"]>>,
    activeWeek: Date,
    setActiveWeek: Dispatch<SetStateAction<AgendaComponentContextType["activeWeek"]>>,
    dateSetWithAgendaItems: Set<string>,
    dateRangeStart: Date,
    dateRangeEnd: Date,
    agendaOptions: AgendaOptions,
};

type AgendaProps<T extends any> = {
    items: Array<AgendaItem<T>>,
    isLoading?: boolean,
    dateRangeStart?: Date,
    dateRangeEnd?: Date,
    initialSelectedDate?: Date,
    renderItem: RenderItemFunction<T>,
    options?: AgendaOptions,
    isRefreshing?: boolean,
    onRefresh?: () => void,
};

type AgendaMonthIndicatorProps = {
    activeWeek: Date,
};

type AgendaItem<T extends any> = {date: Date, items: Array<T>}

type AgendaWeekItemProps = {
    date: Date,
};

type AgendaWeekDayItemProps = {
    date: Date,
};
type WeekDayString = "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";

type RenderItemFunction<T extends any> = (schedule: T, date: Date, index: number) => React.ReactNode;