import type { AgendaItem, AgendaOptions, AgendaStyles, RenderItemFunction } from "@/components/Agenda/types";

import { getDateIdentity, getSafeDateRangeEnd, getSafeDateRangeStart } from "@/components/Agenda/helpers";
import AgendaContentReturnToPresentButton from "@/components/Agenda/AgendaContentReturnToPresentButton";
import AgendaContentRefreshButton from "@/components/Agenda/AgendaContentRefreshButton";
import AgendaContentFlatList from "@/components/Agenda/AgendaContentFlatList";
import AgendaDateSelection from "@/components/Agenda/AgendaSelection";
import { AgendaComponentContext } from "@/components/Agenda/context";
import AgendaUISkeleton from "@/components/Agenda/AgendaUISkeleton";
import { VStack } from "@/components/ui/vstack";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Animated  from "react-native-reanimated";
import { addDays, subDays } from "date-fns";
import { cssInterop } from "nativewind";

const DEFAULT_STARTING_WEEK_DAY = "monday";
const DEFAULT_AVERAGE_GESTURE_INTERVAL_MS = 350;
const DEFAULT_DATE_RANGE_START = subDays(new Date(), 7);
const DEFAULT_DATE_RANGE_END = addDays(new Date(), 7);
cssInterop(Animated.View, { className: 'style' });

export default function Agenda<T extends any>(
    { 
        items, 
        isLoading = false,
        isRefreshing = false,
        onRefresh = () => {},
        hasOutdatedItems = false,
        hasLoadedAllItems = false,
        isLoadingMoreItems = false,
        onLoadMoreItems = () => {},
        renderItem, 
        dateRangeStart = DEFAULT_DATE_RANGE_START, 
        initialDateRangeEnd = DEFAULT_DATE_RANGE_END,
        options,
        styles,
    }: AgendaProps<T>
) {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isPresentDateVisible, setIsPresentDateVisible] = useState(true);
    const prevHasOutdatedItemsValueRef = useRef(hasOutdatedItems);
    const dateSetWithAgendaItems = useMemo(() => {
        const updatedDateSet: Set<string> = new Set();
        for (let index = 0; index < items.length; index++) {
            const itemDate = items[index].date;
            updatedDateSet.add(getDateIdentity(itemDate));
        }
        return updatedDateSet;
    }, [items]);
    // ensures that when the items that are beyond the date range are still selectable
    const safeDateRangeStart = getSafeDateRangeStart(items, dateRangeStart);
    const safeDateRangeEnd = getSafeDateRangeEnd(items, initialDateRangeEnd);
    const handleRefresh = useCallback(() => {
        if (isRefreshing) return;
        onRefresh();
    }, [isRefreshing, onRefresh]);
    const handleLoadMoreItems = useCallback(() => {
        if (isLoadingMoreItems || hasLoadedAllItems) return;
        onLoadMoreItems(safeDateRangeEnd)
    }, [isLoadingMoreItems, hasLoadedAllItems, onLoadMoreItems, safeDateRangeEnd]);
    const handleReturnToPresent = useCallback(() => {
        setSelectedDate(new Date());
        setIsPresentDateVisible(true);
    }, []);
    useEffect(() => {
        if (!hasOutdatedItems && prevHasOutdatedItemsValueRef.current !== hasOutdatedItems) handleReturnToPresent();
        prevHasOutdatedItemsValueRef.current = hasOutdatedItems;
    }, [hasOutdatedItems, handleReturnToPresent])
    return <AgendaComponentContext.Provider value={{
        selectedDate,
        setSelectedDate,
        dateSetWithAgendaItems,
        dateRangeStart: safeDateRangeStart,
        dateRangeEnd: safeDateRangeEnd,
        agendaOptions: Object.assign({
            displayedStartingWeekDay: DEFAULT_STARTING_WEEK_DAY,
            averageGestureIntervalMs: DEFAULT_AVERAGE_GESTURE_INTERVAL_MS,
        }, options),
        styles: Object.assign({
            paddingHorizontal: "md",
            color: "primary",
            itemsSpacing: "md",
            itemGroupSpacing: "md",
            dateSelectionSpacing: "even",
            overheadButtonInset: 15,
            overheadButtonSize: "sm",
            selectionDateFontSize: "sm",
            selectionDateFontCase: "uppercase",
            selectionDateFontWeight: "normal",
        }, styles),
    }}>
        <VStack className="flex-1 bg-[#F5F5F5]">
            {
                isLoading ? 
                <AgendaUISkeleton /> 
                : <>
                    {/* TODO: Break down AgendaDateSelection */}
                    <AgendaDateSelection />
                    <Animated.View className="flex-1 bg-[#F5F5F5] overflow-hidden relative">
                        <AgendaContentFlatList 
                            items={items} 
                            renderItem={renderItem}
                            hasLoadedAllItems={hasLoadedAllItems}
                            isLoadingMoreItems={isLoadingMoreItems}
                            onLoadMoreItems={handleLoadMoreItems}
                            onPresentDateItemVisiblityChange={setIsPresentDateVisible}
                        /> 
                        <AgendaContentReturnToPresentButton 
                            hasOutdatedItems={hasOutdatedItems}
                            isPresentDateVisible={isPresentDateVisible}
                            onPress={handleReturnToPresent}
                        />
                        <AgendaContentRefreshButton 
                            hasOutdatedItems={hasOutdatedItems}
                            refreshing={isRefreshing}
                            onPress={handleRefresh} 
                        />
                    </Animated.View>
                </>
            }
        </VStack>
    </AgendaComponentContext.Provider>
};

/**
 * Props for the Agenda component
 */
type AgendaProps<T extends any> = {
    /** **Required** - Array of agenda items grouped by date */
    items: Array<AgendaItem<T>>,
    /** Whether the agenda is currently loading the initial data, will make the agenda screen display a skeleton UI */
    isLoading?: boolean,
    /** Whether more items are being loaded (paginated/infinite scroll) */
    isLoadingMoreItems?: boolean,
    /** Callback fired when more items need to be loaded, receives the current end date */
    onLoadMoreItems?: (date: Date) => void,
    /** The starting date for the agenda date range (defaults to 7 days ago from the present date) */
    dateRangeStart?: Date,
    /** The initial ending date for the agenda date range (defaults to 7 days from the present date) */
    initialDateRangeEnd?: Date,
    /** Whether all available items have been loaded (disables infinite scroll/pagination) */
    hasLoadedAllItems?: boolean,
    /** Whether the current data is outdated and needs refresh */
    hasOutdatedItems?: boolean,
    /** Configuration options for agenda behavior and display
     * @property {WeekDayString} displayedStartingWeekDay - The starting day of the week ("sunday", "monday", ..etc) to display in the agenda (defaults to "monday")
     * @property {number} averageGestureIntervalMs - The average interval in milliseconds between gestures (defaults to 350ms)
    */
    options?: Partial<AgendaOptions>,
    /** Whether the agenda is currently refreshing */
    isRefreshing?: boolean,
    /** Callback fired when user initiates a refresh */
    onRefresh?: () => void,
    /** **Required** - Function to render each individual agenda item */
    renderItem: RenderItemFunction<T>,
    /** Configuration options for agenda behavior and display
     * @property {string} color - The color of the agenda items (defaults to "#000000")
     * @property {AgendaItemSpacing} itemsSpacing - The spacing between the agenda items (defaults to "sm")
     * @property {AgendaItemSpacing} itemGroupSpacing - The spacing between the agenda item groups (defaults to "sm")
     * @property {AgendaItemSpacing} dateSelectionSpacing - The spacing between the date selection (defaults to "sm")
     * @property {AgendaItemSpacing} overheadButtonInset - The spacing between the overhead button (defaults to "sm")
     * @property {AgendaItemSpacing} overheadButtonSize - The size of the overhead button (defaults to "sm")
     * @property {AgendaItemSpacing} selectionDateFontSize - The font size of the selection date (defaults to "xs")
    */
    styles?: Partial<AgendaStyles>,
};