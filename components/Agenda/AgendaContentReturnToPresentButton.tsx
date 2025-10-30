import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { AgendaComponentContext } from "@/components/Agenda/context";

import Animated, { FadeIn } from "react-native-reanimated";
import { ChevronsUpDownIcon } from "lucide-react-native";
import { StyleSheet } from "react-native";
import { useContext } from "react";

export default function AgendaContentReturnToPresentButton({ hasOutdatedItems, isPresentDateVisible, onPress }: ReturnToPresentButtonProps) {
    const { styles } = useContext(AgendaComponentContext);
    if (hasOutdatedItems || isPresentDateVisible) return null;
    return <Animated.View key="return-to-present-button" entering={FadeIn} style={[
        AgendaContentReturnToPresentButtonStyles.container,
        { top: styles.overheadButtonInset }
    ]}>
        <Button onPress={onPress} size={styles.overheadButtonSize} className="rounded-full"> 
            <ButtonIcon as={ChevronsUpDownIcon} size="md" stroke="white" />
            <ButtonText>Return to present</ButtonText>
        </Button>
    </Animated.View>
}

const AgendaContentReturnToPresentButtonStyles = StyleSheet.create({
    container: {
        position: "absolute",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    }
});

type ReturnToPresentButtonProps = {
    hasOutdatedItems: boolean,
    isPresentDateVisible: boolean,
    onPress: () => void;
}