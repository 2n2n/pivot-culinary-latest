import type React from "react";

import { EventDetailsContext } from "@/components/EventDetails/EventDetailsContext";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";

import * as Linking from "expo-linking";
import { NotepadText } from "lucide-react-native";
import { useCallback, useContext } from "react";
import { PilledButton } from "../styled/PilledButton";

const EventDetailsBEO: React.FC<React.ComponentProps<typeof Button>> = (props = {}) => {
    const { event } = useContext(EventDetailsContext);
    const handlePress = useCallback(props.onPress || (async () => {
        if (!event?.beoUrl) return;
        if (await Linking.canOpenURL(event.beoUrl)) await Linking.openURL(event.beoUrl);
    }), [props.onPress]);
    return <PilledButton {...props} onPress={handlePress} className="bg-pivot">
        <ButtonIcon as={NotepadText} />
        <ButtonText className="text-sm">Banquet Event Order</ButtonText>
    </PilledButton>
};

export default EventDetailsBEO;