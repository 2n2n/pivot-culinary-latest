import type { AgendaOptions } from "@/components/Agenda/types";
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
    }
});

type AgendaComponentContextType = {
    selectedDate: Date,
    setSelectedDate: Dispatch<SetStateAction<AgendaComponentContextType["selectedDate"]>>,
    dateSetWithAgendaItems: Set<string>,
    dateRangeStart: Date,
    dateRangeEnd: Date,
    agendaOptions: AgendaOptions,
};