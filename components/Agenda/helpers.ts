import type { AgendaItem } from "@/components/Agenda/types";

import { addDays, differenceInDays, format, isSameDay, max, min } from "date-fns";

const CONSTANT_DATE_STRING_FORMAT = "MM/dd/yyyy";

export const getDateIdentity = (date: Date) => format(date, CONSTANT_DATE_STRING_FORMAT);

export const fillGapsInDateGroups = <T extends any>(dateGroups: Array<AgendaItem<T>>) => {
    if (!dateGroups.length) return dateGroups;
    const startDate = dateGroups[0].date;
    const endDate = dateGroups[dateGroups.length - 1].date;
    if (isSameDay(startDate, endDate)) return dateGroups;
    const updatedItemsWithFilledGaps: Array<AgendaItem<T>> = [];
    const maxNumberOfDays = differenceInDays(endDate, startDate);
    for (let i = 0; i <= maxNumberOfDays; i++) {
        const currentDate = addDays(startDate, i);
        const itemGroup = dateGroups.find((item) => isSameDay(item.date, currentDate));
        if (itemGroup) updatedItemsWithFilledGaps.push(itemGroup);
        else updatedItemsWithFilledGaps.push({ date: currentDate, items: [] });
    }
    return updatedItemsWithFilledGaps;
}

export const getSafeDateRangeStart = (items: Array<AgendaItem<any>>, dateRangeStart: Date) => {
    let earliestDate = dateRangeStart;
    if (items.length) earliestDate = min([earliestDate, items[0].date, new Date()]);
    return earliestDate;
}
export const getSafeDateRangeEnd = (items: Array<AgendaItem<any>>, dateRangeEnd: Date) => {
    const dateToCompare = items.length ? [dateRangeEnd, new Date(), items[items.length - 1].date] : [dateRangeEnd, new Date()];
    return max(dateToCompare);
}