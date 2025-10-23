import type { LegendListRef, OnViewableItemsChanged } from "@legendapp/list";

import { ContentItemSkeleton, ContentItemSubSkeleton } from "@/components/Agenda/AgendaUISkeleton";
import AgendaContentItemDateDetails from "@/components/Agenda/AgendaContentItemDateDetails";
import { fillGapsInDateGroups, getDateIdentity } from "@/components/Agenda/helpers";
import { AgendaItem, RenderItemFunction } from "@/components/Agenda/types";
import { AgendaComponentContext } from "@/components/Agenda/context";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";

import React, { useContext, useEffect, useMemo, useRef } from "react";
import { LegendList as FlatList } from "@legendapp/list";
import { isAfter, isSameDay, isToday } from "date-fns";

export default function AgendaContentFlatList<T extends any>({ 
    items,
    renderItem,
    isLoadingMoreItems = false,
    hasLoadedAllItems = true,
    onPresentDateItemVisiblityChange = () => {},
    onLoadMoreItems
}: AgendaContentFlatListProps<T>){
    const { selectedDate, setSelectedDate } = useContext(AgendaComponentContext);
    const agendaContentFlatListRef = useRef<LegendListRef>(null);
    const autoScrollUnlockDebounceRef = useRef<number>(null);
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
    }, [getDateIdentity(selectedDate)]);
    const handleOnChangeVisibleItemIndexes = (firstViewableIndex: number, lastViewableIndex: number) => {
        console.log("🚀 ~ handleOnChangeVisibleItemIndexes ~ lastViewableIndex:", lastViewableIndex)
        console.log("🚀 ~ handleOnChangeVisibleItemIndexes ~ firstViewableIndex:", firstViewableIndex)
        if (presentDateItemIndex >= firstViewableIndex && presentDateItemIndex <= lastViewableIndex) {
            onPresentDateItemVisiblityChange(true);
            console.log("visible")
        } else {
            onPresentDateItemVisiblityChange(false);
            console.log("invisible")
        };
    }
    const handleViewableItemDateChange: NonNullable<OnViewableItemsChanged<AgendaItem<T>>> = ({ changed, viewableItems }) => {
        if(!autoScrollIsReadyRef.current) return;
        handleOnChangeVisibleItemIndexes(viewableItems[0].index, viewableItems[viewableItems.length - 1].index);
        if (!autoScrollIsLockedRef.current) return;
        const firstViewable = changed.find(item => item.isViewable);
        if (firstViewable) setSelectedDate(firstViewable.item.date);
    };
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
            }, 500);
            return () => clearTimeout(timeout);
        } else {
            agendaContentFlatListRef.current.scrollToIndex({ index: derivedSelectedDateIndex, animated: true });
        }
    }, [derivedSelectedDateIndex]);
    return <FlatList
        ref={agendaContentFlatListRef}
        data={itemsWithFilledGaps}
        keyExtractor={(item) => getDateIdentity(item.date)}
        renderItem={({ item: itemGroup }) => <HStack className="w-full gap-2 px-4">
            <AgendaContentItemDateDetails date={itemGroup.date} />
            {
                itemGroup.items.length ? 
                <VStack className="flex-1 gap-2">
                    {itemGroup.items.map((item, itemIndex) => <React.Fragment key={`${itemGroup.date}-${itemIndex}`}>
                        {renderItem(item, itemGroup.date)}
                    </React.Fragment>)}
                </VStack>
                : <Center className="flex-1 border border-dashed rounded-lg h-full border-gray-400">
                    <Text>No activity on this day</Text>
                </Center>
            }
        </HStack>}
        ItemSeparatorComponent={() => <Box className="w-[calc(100%-32px)] h-[1px] bg-slate-300 my-6 mx-4" />}
        ListFooterComponent={() => isLoadingMoreItems && <ContentItemSkeleton>
            <ContentItemSubSkeleton/>
        </ContentItemSkeleton>}
        ListFooterComponentStyle={{ 
            height: isLoadingMoreItems ? 250 : 0, 
            paddingTop: 16,
            paddingHorizontal: 16,
            justifyContent: "flex-start", 
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
            }, 350);
        }}
        onViewableItemsChanged={handleViewableItemDateChange}
        viewabilityConfig={{
            itemVisiblePercentThreshold: 50
        }}
        onEndReached={onLoadMoreItems}
        onEndReachedThreshold={0.5}
        className="flex-1"
        scrollEventThrottle={250} 
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