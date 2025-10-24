import type { AgendaOptions, AgendaStyles } from "@/components/Agenda/types";
import type { Dispatch, SetStateAction } from "react";

import { createContext } from "react";

// TODO: Eliminate context use
export const AgendaComponentContext = createContext<AgendaComponentContextType>({
    selectedDate: new Date(),
    setSelectedDate: () => {},
    dateSetWithAgendaItems: new Set(),
    dateRangeStart: new Date(),
    dateRangeEnd: new Date(),
    agendaOptions: {
        displayedStartingWeekDay: "monday",
        averageGestureIntervalMs: 350,
    },
    styles: {
        color: "primary",
        itemsSpacing: "sm",
        itemGroupSpacing: "sm",
        dateSelectionSpacing: "sm",
        overheadButtonInset: 15,
        overheadButtonSize: "sm",
        selectionDateFontSize: "xs",
        paddingHorizontal: "md",
        selectionDateFontCase: "uppercase",
        selectionDateFontWeight: "normal",
    },
});

type AgendaComponentContextType = {
    /** The currently selected date in the agenda */
    selectedDate: Date,
    /** React setState function to update the currently selected date in the agenda */
    setSelectedDate: Dispatch<SetStateAction<AgendaComponentContextType["selectedDate"]>>,
    /** A set of date strings representing the dates with agenda items */
    dateSetWithAgendaItems: Set<string>,
    /** The start date of the date range in the agenda */
    dateRangeStart: Date,
    /** The end date of the date range in the agenda */
    dateRangeEnd: Date,
    /** Configuration options for agenda behavior and display
     * @property {WeekDayString} displayedStartingWeekDay - The starting day of the week ("sunday", "monday", ..etc) to display in the agenda (defaults to "monday")
     * @property {number} averageGestureIntervalMs - The average interval in milliseconds between gestures (defaults to 350ms)
    */
    agendaOptions: AgendaOptions,
    /** Configuration options for agenda behavior and display
     * @property {string} color - The color of the agenda items (defaults to "primary")
     * @property {AgendaItemSpacing} itemsSpacing - The spacing between the agenda items (defaults to "sm")
     * @property {AgendaItemSpacing} itemGroupSpacing - The spacing between the agenda item groups (defaults to "sm")
     * @property {AgendaItemSpacing} dateSelectionSpacing - The spacing between the date selection (defaults to "sm")
     * @property {AgendaItemSpacing} overheadButtonInset - The spacing between the overhead button (defaults to "sm")
     * @property {AgendaItemSpacing} overheadButtonSize - The size of the overhead button (defaults to "sm")
     * @property {AgendaItemSpacing} selectionDateFontSize - The font size of the selection date (defaults to "xs")
     * @property {AgendaItemSpacing} selectionDateFontCase - The font case of the selection date (defaults to "uppercase")
     * @property {AgendaItemSpacing} selectionDateFontWeight - The font weight of the selection date (defaults to "normal")
    */
    styles: AgendaStyles,
};