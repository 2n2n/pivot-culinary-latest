import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { AgendaComponentContext } from "@/components/Agenda/context";

import Animated, { FadeIn } from "react-native-reanimated";
import { ChevronsUpDownIcon } from "lucide-react-native";
import { cssInterop } from "nativewind";
import { useContext } from "react";

cssInterop(Animated.View, { className: 'style' });

export default function AgendaContentReturnToPresentButton({ hasOutdatedItems, isPresentDateVisible, onPress }: ReturnToPresentButtonProps) {
    const { styles } = useContext(AgendaComponentContext);
    if (hasOutdatedItems || isPresentDateVisible) return null;
    return <Animated.View key="return-to-present-button" entering={FadeIn} style={{
        position: "absolute",
        top: styles.overheadButtonInset,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    }}>
        <Button onPress={onPress} size={styles.overheadButtonSize} className="rounded-full"> 
            <ButtonIcon as={ChevronsUpDownIcon} size={18} stroke="white" />
            <ButtonText>Return to present</ButtonText>
        </Button>
    </Animated.View>
}

type ReturnToPresentButtonProps = {
    hasOutdatedItems: boolean,
    isPresentDateVisible: boolean,
    onPress: () => void;
}