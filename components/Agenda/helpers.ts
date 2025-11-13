import type { AgendaItem } from "@/components/Agenda/types";

import { addDays, differenceInDays, format, isSameDay, max, min } from "date-fns";

const CONSTANT_DATE_STRING_FORMAT = "MM/dd/yyyy";

/**
 * Returns a consistent string representation for a given Date, using the format "MM/dd/yyyy".
 * Used for quickly comparing dates without relying on object instance equality, 
 * specially on useEffect deps and set objects.
 * 
 * @param {Date} date - The date to turn into a comparable identity string.
 * @returns {string} - The identity string in "MM/dd/yyyy" format.
 */
export const getDateIdentity = (date: Date) => format(date, CONSTANT_DATE_STRING_FORMAT);

/**
 * Given an array of AgendaItem<T> grouped by date (each with a `date` property),
 * returns a new array where any missing days in the range are filled with empty groups.
 *
 * This ensures each day between the first and last date (inclusive) is represented
 * with a group, even if there are no items for that day.
 * 
 * @template T
 * @param {Array<AgendaItem<T>>} dateGroups - The input array of grouped agenda items, ordered by date.
 * @returns {Array<AgendaItem<T>>} New array with gaps filled; groups with no items have empty `items` arrays.
 *
 * @example
 * // If given [ {date: 2024-01-01, items: [...]}, {date: 2024-01-03, items: [...]} ]
 * // Returns [
 * //   {date: 2024-01-01, items: [...]},
 * //   {date: 2024-01-02, items: []},
 * //   {date: 2024-01-03, items: [...]}
 * // ]
 */
export const fillGapsInDateGroups = <T extends any>(dateGroups: Array<AgendaItem<T>> = [], options: { dateRangeStart?: Date, dateRangeEnd?: Date } = {}) => {
    const startDate = options.dateRangeStart || dateGroups[0].date;
    const endDate = options.dateRangeEnd || dateGroups[dateGroups.length - 1].date;
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

/**
 * Ensures the returned date range does not go after the latest of the given items' date, the given dateRangeEnd, or the present date.
 * 
 * @param {Array<AgendaItem<any>>} items - Array of agenda items, each with a `date` property.
 * @param {Date} dateRangeEnd - The intended end of the date range.
 * @returns {Date} The safe maximum end date: the latest of dateRangeEnd, the present date, and the last item's date.
 */
export const getSafeDateRangeStart = (items: Array<AgendaItem<any>>, dateRangeStart: Date) => {
    let earliestDate = dateRangeStart;
    if (items.length) earliestDate = min([earliestDate, items[0].date, new Date()]);
    return earliestDate;
}

/**
 * Ensures the returned date range does not go before the earliest of the given items' date, the given dateRangeStart, or the present date.
 * 
 * @param {Array<AgendaItem<any>>} items - Array of agenda items, each with a `date` property.
 * @param {Date} dateRangeStart - The intended start of the date range.
 * @returns {Date} The safe minimum start date: the earliest of dateRangeStart, the present date, and the first item's date.
 */
export const getSafeDateRangeEnd = (items: Array<AgendaItem<any>>, dateRangeEnd: Date) => {
    const dateToCompare = items.length ? [dateRangeEnd, new Date(), items[items.length - 1].date] : [dateRangeEnd, new Date()];
    return max(dateToCompare);
}