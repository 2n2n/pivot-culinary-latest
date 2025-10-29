import EventDetailsManagerAccount from "@/components/EventDetails/EventDetailsManagerAccount";
import EventDetailsGuestCount from "@/components/EventDetails/EventDetailsGuestCount";
import EventDetailsFinancial from "@/components/EventDetails/EventDetailsFinancial";
import EventDetailsTimeRange from "@/components/EventDetails/EventDetailsTimeRange";
import EventDetailsDateRange from "@/components/EventDetails/EventDetailsDateRange";
import { EventDetailsContext } from "@/components/EventDetails/EventDetailsContext";
import EventDetailsAddress from "@/components/EventDetails/EventDetailsAddress";
import EventDetailsName from "@/components/EventDetails/EventDetailsName";
import EventDetailsBEO from "@/components/EventDetails/EventDetailsBEO";
import { VStack } from "@/components/ui/vstack";
import { twMerge } from "tailwind-merge";

type EventDetailsProps = {
  event: BookingEvent;
  pending?: boolean;
  showBeo?: boolean;
  showFinance?: boolean;
  children: React.ReactNode;
} & Pick<
  React.ComponentProps<typeof VStack>,
  "className" | "style" | "space" | "reversed"
>;

const EventDetails: EventDetailsComponent = ({
  event,
  pending = false,
  showFinance = false,
  showBeo = false,
  children,
  ...stackProps
}) => {
  if (!event) return null;
  return (
    <EventDetailsContext.Provider
      value={{ event, showFinance, showBeo, pending }}
    >
      <VStack
        className={twMerge("gap-2 px-4", stackProps.className)}
        {...stackProps}
      >
        {children}
      </VStack>
    </EventDetailsContext.Provider>
  );
};

type EventDetailsComponent = React.FC<EventDetailsProps> & {
  Name: typeof EventDetailsName;
  TimeRange: typeof EventDetailsTimeRange;
  GuestCount: typeof EventDetailsGuestCount;
  Financial: typeof EventDetailsFinancial;
  Address: typeof EventDetailsAddress;
  Date: typeof EventDetailsDateRange;
  BEO: typeof EventDetailsBEO;
  ManagerAccount: typeof EventDetailsManagerAccount;
};

EventDetails.Financial = EventDetailsFinancial;
EventDetails.GuestCount = EventDetailsGuestCount;
EventDetails.TimeRange = EventDetailsTimeRange;
EventDetails.Address = EventDetailsAddress;
EventDetails.Date = EventDetailsDateRange;
EventDetails.Name = EventDetailsName;
EventDetails.BEO = EventDetailsBEO;
EventDetails.ManagerAccount = EventDetailsManagerAccount;

export default EventDetails;
