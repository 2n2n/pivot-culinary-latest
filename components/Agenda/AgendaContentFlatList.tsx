import type { LegendListRef, OnViewableItemsChanged } from "@legendapp/list";

import { ContentItemSkeleton, ContentItemSubSkeleton } from "@/components/Agenda/AgendaUISkeleton";
import AgendaContentItemDateDetails from "@/components/Agenda/AgendaContentItemDateDetails";
import { fillGapsInDateGroups, getDateIdentity } from "@/components/Agenda/helpers";
import { AgendaItem, RenderItemFunction } from "@/components/Agenda/types";
import { AgendaComponentContext } from "@/components/Agenda/context";
import { tva } from "@gluestack-ui/utils/nativewind-utils";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";

import React, { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { LegendList as FlatList } from "@legendapp/list";
import { isAfter, isSameDay, isToday } from "date-fns";

const itemGroupSectionStyles = tva({
    base: 'w-full px-4',
    variants: {
        space: {
            sm: 'gap-1',
            md: 'gap-2',
            lg: 'gap-4',

        },
        padding: {
            sm: 'px-2',
            md: 'px-4',
            lg: 'px-6'
        }
    },
});

const itemGroupStyles = tva({
    base: 'flex-1 gap-2',
    variants: {
        space: {
            sm: 'gap-1',
            md: 'gap-2',
            lg: 'gap-4',
        }
    },
});

const itemGroupSeparatorStyles = tva({
    base: 'w-[calc(100%-32px)] h-[1px] bg-slate-300 my-6 mx-4',
    variants: {
        space: {
            sm: 'my-4',
            md: 'my-6',
            lg: 'my-8',
        },
        padding: {
            sm: 'mx-2',
            md: 'mx-4',
            lg: 'mx-6'
        }
    },
});

export default function AgendaContentFlatList<T extends any>({ 
    items,
    renderItem,
    isLoadingMoreItems = false,
    hasLoadedAllItems = true,
    onPresentDateItemVisiblityChange = () => {},
    onLoadMoreItems
}: AgendaContentFlatListProps<T>){
    const { selectedDate, setSelectedDate, agendaOptions, styles } = useContext(AgendaComponentContext);
    const agendaContentFlatListRef = useRef<LegendListRef>(null);
    const autoScrollUnlockDebounceRef = useRef<number>(null);
    const handleOnChangeVisibleItemIndexesDebounceRef = useRef<number>(null);
    const itemsWithFilledGapsRef = useRef<typeof items>([]);
    const autoScrollIsLockedRef = useRef(false);
    const autoScrollIsReadyRef = useRef(false);
    const { itemsWithFilledGaps, presentDateItemIndex } = useMemo(() => {
        const updatedFilledGapsInDateGroups = fillGapsInDateGroups(items);
        // this allows me to use the items in the useeffect without me adding it as
        // a dependency: i want the useeffect below to only run when and only when 
        // selected date is changed
        itemsWithFilledGapsRef.current = updatedFilledGapsInDateGroups;
        const presentDateItemIndex = updatedFilledGapsInDateGroups.findIndex(item => isToday(item.date));
        return { itemsWithFilledGaps: updatedFilledGapsInDateGroups, presentDateItemIndex };
    }, [items]);
    const derivedSelectedDateIndex = useMemo(() => {
        return itemsWithFilledGapsRef.current.findIndex(item => isSameDay(item.date, selectedDate));
        // rely on the date's string representation instead of Date object reference
    }, [getDateIdentity(selectedDate)]);
    const handleOnChangeVisibleItemIndexes = useCallback((firstViewableIndex: number, lastViewableIndex: number) => {
        if (handleOnChangeVisibleItemIndexesDebounceRef.current != null) clearTimeout(handleOnChangeVisibleItemIndexesDebounceRef.current);
        if (!firstViewableIndex && typeof lastViewableIndex !== "number" || !lastViewableIndex && typeof firstViewableIndex !== "number") return;
        if (presentDateItemIndex >= firstViewableIndex && presentDateItemIndex <= lastViewableIndex) onPresentDateItemVisiblityChange(true);
        else handleOnChangeVisibleItemIndexesDebounceRef.current = setTimeout(() => {
            onPresentDateItemVisiblityChange(false);
        }, agendaOptions.averageGestureIntervalMs);
    }, [presentDateItemIndex, onPresentDateItemVisiblityChange, agendaOptions.averageGestureIntervalMs]);
    const handleViewableItemDateChange: NonNullable<OnViewableItemsChanged<AgendaItem<T>>> = useCallback(({ changed, viewableItems }) => {
        if(!autoScrollIsReadyRef.current) return;
        handleOnChangeVisibleItemIndexes(viewableItems[0]?.index, viewableItems[viewableItems.length - 1]?.index);
        if (!autoScrollIsLockedRef.current) return;
        const firstViewable = changed.find(item => item.isViewable);
        if (firstViewable) setSelectedDate(firstViewable.item.date);
    }, [handleOnChangeVisibleItemIndexes]);
    useEffect(() => {
        if (autoScrollIsLockedRef.current || !itemsWithFilledGapsRef.current.length || !agendaContentFlatListRef.current) return;
        if (derivedSelectedDateIndex === -1) {
            const selectedDateIsBeyondAgendaItemDates = isAfter(selectedDate, itemsWithFilledGapsRef.current[itemsWithFilledGapsRef.current.length - 1].date);
            if (selectedDateIsBeyondAgendaItemDates) {
                agendaContentFlatListRef.current.scrollToEnd();
            } else {
                agendaContentFlatListRef.current.scrollToIndex({ index: 0, animated: true });
                agendaContentFlatListRef.current.scrollToOffset({ offset: -200, animated: true });
            }
        } else if (!autoScrollIsReadyRef.current) {
            const timeout = setTimeout(() => {
                agendaContentFlatListRef?.current?.scrollToIndex({ index: derivedSelectedDateIndex, animated: true });
                autoScrollIsReadyRef.current = true;
            }, agendaOptions.averageGestureIntervalMs);
            return () => clearTimeout(timeout);
        } else agendaContentFlatListRef.current.scrollToIndex({ index: derivedSelectedDateIndex, animated: true });
    }, [derivedSelectedDateIndex]);
    return <FlatList
        ref={agendaContentFlatListRef}
        data={itemsWithFilledGaps}
        keyExtractor={(item) => getDateIdentity(item.date)}
        renderItem={({ item: itemGroup }) => <HStack className={itemGroupSectionStyles({ space: styles.itemsSpacing, padding: styles.paddingHorizontal })}>
            <AgendaContentItemDateDetails date={itemGroup.date} />
            {
                itemGroup.items.length ? 
                <VStack className={itemGroupStyles({ space: styles.itemsSpacing })}>
                    {itemGroup.items.map((item, itemIndex) => <React.Fragment key={`${itemGroup.date}-${itemIndex}`}>
                        {renderItem(item, itemGroup.date)}
                    </React.Fragment>)}
                </VStack>
                : <Center className="flex-1 border border-dashed rounded-lg h-full border-gray-400">
                    <Text>No activity on this day</Text>
                </Center>
            }
        </HStack>}
        ItemSeparatorComponent={() => <Box className={itemGroupSeparatorStyles({ space: styles.itemGroupSpacing, padding: styles.paddingHorizontal || "md" })} />}
        ListFooterComponent={() => <>
            {
                isLoadingMoreItems && <ContentItemSkeleton>
                    <ContentItemSubSkeleton/>
                </ContentItemSkeleton>
            }
            {
                hasLoadedAllItems && <Center className="flex-1">
                    <Text className="text-center text-gray-500">No further activities yet.</Text>
                </Center>
            }
        </>}
        ListFooterComponentStyle={{ 
            height: isLoadingMoreItems ? 250 : hasLoadedAllItems ? 100 : 0, 
            paddingTop: isLoadingMoreItems || hasLoadedAllItems ? 16 : 0,
            paddingHorizontal: 16,
            justifyContent: isLoadingMoreItems || hasLoadedAllItems ? "flex-start" : "center", 
            overflow: "hidden"
        }}
        decelerationRate="fast"
        overScrollMode="never"
        scrollToOverflowEnabled={false}
        contentContainerClassName="py-4"
        onScrollBeginDrag={() => {
            if (autoScrollUnlockDebounceRef.current != null) clearTimeout(autoScrollUnlockDebounceRef.current);
            if (!autoScrollIsLockedRef.current) autoScrollIsLockedRef.current = true;
        }}
        onScrollEndDrag={() => { 
            autoScrollUnlockDebounceRef.current = setTimeout(() => {
                if (autoScrollIsLockedRef.current) autoScrollIsLockedRef.current = false;
            }, agendaOptions.averageGestureIntervalMs);
        }}
        onViewableItemsChanged={handleViewableItemDateChange}
        viewabilityConfig={{
            itemVisiblePercentThreshold: 50
        }}
        onEndReached={onLoadMoreItems}
        onEndReachedThreshold={0.5}
        className="flex-1"
        scrollEventThrottle={agendaOptions.averageGestureIntervalMs} 
    />
}

type AgendaContentFlatListProps<T extends any> = {
    items: Array<AgendaItem<T>>,
    renderItem: RenderItemFunction<T>,
    hasLoadedAllItems: boolean,
    isLoadingMoreItems: boolean,
    onLoadMoreItems: () => void,
    onPresentDateItemVisiblityChange: (isVisible: boolean) => void,
};