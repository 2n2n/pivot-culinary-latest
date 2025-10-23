export type WeekDayString = "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";


export type AgendaOptions = {
    displayedStartingWeekDay: WeekDayString,
};

export type AgendaItem<T extends any> = {date: Date, items: Array<T>};

export type RenderItemFunction<T extends any> = (schedule: T, date: Date) => React.ReactNode;