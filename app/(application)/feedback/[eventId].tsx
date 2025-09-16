import useGesture from "@/hooks/useGesture";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";

function Feedback() {
  const { SwipeableComponent } = useGesture();
  return (
    <SwipeableComponent className="flex flex-1">
      <Box className="flex flex-1">
        <Text>Feedback</Text>
      </Box>
    </SwipeableComponent>
  );
}

export default Feedback;
