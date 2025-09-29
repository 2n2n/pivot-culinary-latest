export type BookingEvent = {
    id: string;
    name: string;
    amount: number | string;
    status: "DEFINITE" | "TENTATIVE" | "CANCELLED";
    startTime: string,
    endTime: string,
    startDate?: Date,
    endDate?: Date,
    address: string,
    guests: number,
    beoUrl?: string,
    managerAccount?: {
        name: string;
        role: string;
        phone: string;
        image: string;
    };
}