import AgendaEventCardPostFeedbackButton from "@/components/AgendaEventCard/AgendaEventCardPostFeedbackButton";
import AgendaEventCardStarRating from "@/components/AgendaEventCard/AgendaEventCardStarRating";
import AgendaDirectusEventCard from "@/components/AgendaEventCard/AgendaDirectusEventCard";
import AgendaEventCard from "@/components/AgendaEventCard/AgendaEventCard";

import { isToday } from "date-fns";

export default function AgendaContentCard({ item, date }: AgendaContentCardProps) {
    if (item.type === "tripleseat-event") return <AgendaEventCard event={item}>
        <AgendaEventCardStarRating eventId={item.id} />
            {isToday(date) && <AgendaEventCardPostFeedbackButton eventId={item.id} />}
        </AgendaEventCard> 
    else if (item.type === "directus-event") return <AgendaDirectusEventCard event={item} />;
    else return null;
};

type AgendaContentCardProps = {
    item: GenericEvent;
    date: Date;
};