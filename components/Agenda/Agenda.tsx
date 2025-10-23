import type { AgendaItem, AgendaOptions, RenderItemFunction } from "@/components/Agenda/types";

import { getDateIdentity, getSafeDateRangeEnd, getSafeDateRangeStart } from "@/components/Agenda/helpers";
import AgendaContentReturnToPresentButton from "@/components/Agenda/AgendaContentReturnToPresentButton";
import AgendaContentRefreshButton from "@/components/Agenda/AgendaContentRefreshButton";
import AgendaContentFlatList from "@/components/Agenda/AgendaContentFlatList";
import AgendaDateSelection from "@/components/Agenda/AgendaSelection";
import { AgendaComponentContext } from "@/components/Agenda/context";
import AgendaUISkeleton from "@/components/Agenda/AgendaUISkeleton";
import { VStack } from "@/components/ui/vstack";

import { useCallback, useEffect, useMemo, useState } from "react";
import { addDays, subDays } from "date-fns";

const DEFAULT_STARTING_WEEK_DAY = "monday";
const DEFAULT_DATE_RANGE_START = subDays(new Date(), 7);
const DEFAULT_DATE_RANGE_END = addDays(new Date(), 7);

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
        dateRangeStart = DEFAULT_DATE_RANGE_START, // 
        initialDateRangeEnd = DEFAULT_DATE_RANGE_END,
        options = {
            displayedStartingWeekDay: DEFAULT_STARTING_WEEK_DAY,
        }
    }: AgendaProps<T>
) {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isPresentDateVisible, setIsPresentDateVisible] = useState(true);
    useEffect(() => {
        console.log(isPresentDateVisible)
    },[isPresentDateVisible])
    // this is used as a super quick lookup for which dates have an actual event/agenda items
    const dateSetWithAgendaItems = useMemo(() => {
        const updatedDateSet: Set<string> = new Set();
        for (let i = 0; i < items.length; i++) {
            const itemDate = items[i].date;
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
        if (isLoadingMoreItems) return;
        onLoadMoreItems(safeDateRangeEnd)
    }, [isLoadingMoreItems, onLoadMoreItems, safeDateRangeEnd]);
    return <AgendaComponentContext.Provider value={{
        selectedDate,
        setSelectedDate,
        dateSetWithAgendaItems,
        dateRangeStart: safeDateRangeStart,
        dateRangeEnd: safeDateRangeEnd,
        agendaOptions: options,
    }}>
        <VStack className="flex-1 bg-[#F5F5F5]">
            {
                isLoading ? 
                <AgendaUISkeleton /> 
                : <>
                    // TODO: Break down AgendaDateSelection
                    <AgendaDateSelection />
                    <VStack className="flex-1 bg-[#F5F5F5] overflow-hidden">
                        <AgendaContentFlatList 
                            items={items} 
                            renderItem={renderItem}
                            hasLoadedAllItems={hasLoadedAllItems}
                            isLoadingMoreItems={isLoadingMoreItems}
                            onLoadMoreItems={handleLoadMoreItems}
                            onPresentDateItemVisiblityChange={setIsPresentDateVisible}
                        />
                        <AgendaContentRefreshButton 
                            hasOutdatedItems={hasOutdatedItems}
                            refreshing={isRefreshing}
                            onPress={handleRefresh} 
                        />
                        <AgendaContentReturnToPresentButton 
                            hasOutdatedItems={hasOutdatedItems}
                            isPresentDateVisible={isPresentDateVisible}
                            onPress={() => setSelectedDate(new Date())}
                        />
                    </VStack>
                </>
            }
        </VStack>
    </AgendaComponentContext.Provider>
};

type AgendaProps<T extends any> = {
    items: Array<AgendaItem<T>>,
    isLoading?: boolean,
    isLoadingMoreItems?: boolean,
    onLoadMoreItems?: (date: Date) => void,
    dateRangeStart?: Date,
    initialDateRangeEnd?: Date,
    hasLoadedAllItems?: boolean,
    hasOutdatedItems?: boolean,
    options?: AgendaOptions,
    isRefreshing?: boolean,
    onRefresh?: () => void,
    renderItem: RenderItemFunction<T>,
};