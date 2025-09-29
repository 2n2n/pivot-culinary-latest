import type { BookingEvent } from "@/types/event";

import { createContext } from "react";

export const EventDetailsContext = createContext<{
    event: BookingEvent | null,
    showFinance: boolean,
    showBeo: boolean,
    pending: boolean,
}>({
    event: null,
    showFinance: false,
    showBeo: false,
    pending: false,
});