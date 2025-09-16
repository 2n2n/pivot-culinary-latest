import { View } from "@/components/Themed";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

const TextWithIcon = ({
  icon,
  text,
}: {
  icon: React.ComponentType<any>;
  text: string;
}) => {
  return (
    <View className="flex-row items-center py-1">
      <Icon as={icon} className="w-5 h-5 text-orange-500 mr-2" />
      <Text className="text-sm font-medium">{text}</Text>
    </View>
  );
};

export default TextWithIcon;
