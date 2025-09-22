import useGesture from "@/hooks/useGesture";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";

function Feedback() {
  const { SwipeableComponent } = useGesture();
  return (
    <SwipeableComponent style={{ flex: 1, borderWidth: 1, borderColor: "red" }}>
      <Box className="flex flex-1">
        <Text>Feedback</Text>
        <Button onPress={() => {
          console.log("Hello world");
        }}>
          <ButtonText>
            Hello world
          </ButtonText>
        </Button>
      </Box>
    </SwipeableComponent>
  );
}

export default Feedback;
