import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { AddIcon } from "@/components/ui/icon";

import { Link } from "expo-router";

export default function AgendaEventCardPostFeedbackButton({ eventId }: { eventId: number }) {
    return <Link href={`/(application)/feedback/${eventId}`} asChild>
        <Button className="w-min rounded-full">
            <ButtonIcon as={AddIcon}/>
            <ButtonText action="primary">Post Feedback</ButtonText>
        </Button>
    </Link>
}