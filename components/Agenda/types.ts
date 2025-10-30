export type WeekDayString = "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";


export type AgendaOptions = {
    /** The starting day of the week to display in the agenda (defaults to "monday") */
    displayedStartingWeekDay: WeekDayString,
    /** The average interval in milliseconds between gestures (defaults to 350ms) */
    averageGestureIntervalMs: number,
};

export type AgendaStyles = {
    /** The spacing between the item group section */
    paddingHorizontal: "sm" | "md" | "lg",
    /** The spacing between the agenda items */
    itemsSpacing: "sm" | "md" | "lg",
    /** The spacing between the agenda item groups */
    itemGroupSpacing: "sm" | "md" | "lg",
    /** The spacing between the date selection */
    dateSelectionSpacing: "sm" | "md" | "lg" | "even",
    /** The spacing between the overhead button */
    overheadButtonInset: number,
    /** The size of the overhead button */
    overheadButtonSize: "sm" | "md" | "lg",
    /** The font size of the selection date */
    selectionDateFontSize: "xs" | "sm" | "md" | "lg" | "xl" | "2xl",
    /** The font case of the selection date */
    selectionDateFontCase: "uppercase" | "lowercase" | "capitalize",
    /** The font weight of the selection date */
    selectionDateFontWeight: "light" | "normal" | "bold" | "extrablack",
}

/**
 * An item in the agenda, grouped by date
 */
export type AgendaItem<T extends any> = {date: Date, items: Array<T>};

/**
 * Function to render an individual agenda item
 */
export type RenderItemFunction<T extends any> = (schedule: T, date: Date) => React.ReactNode;