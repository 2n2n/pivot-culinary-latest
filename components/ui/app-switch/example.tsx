import React, { useState } from "react";
import { View, Text } from "react-native";
import { AppSwitch } from "./index";

export const AppSwitchExample = () => {
  const [basicSwitch, setBasicSwitch] = useState(false);
  const [primarySwitch, setPrimarySwitch] = useState(true);
  const [successSwitch, setSuccessSwitch] = useState(false);
  const [outlineSwitch, setOutlineSwitch] = useState(true);
  const [disabledSwitch, setDisabledSwitch] = useState(false);

  return (
    <View className="p-6 space-y-6">
      <Text className="text-2xl font-bold text-typography-900 mb-4">
        AppSwitch Examples
      </Text>

      {/* Basic Switch */}
      <View className="space-y-2">
        <Text className="text-lg font-semibold text-typography-800">
          Basic Switch
        </Text>
        <AppSwitch
          value={basicSwitch}
          onValueChange={setBasicSwitch}
          showText
          activeText="On"
          inactiveText="Off"
        />
      </View>

      {/* Different Sizes */}
      <View className="space-y-2">
        <Text className="text-lg font-semibold text-typography-800">
          Different Sizes
        </Text>
        <View className="flex-row items-center space-x-4">
          <AppSwitch size="sm" value={true} />
          <AppSwitch size="md" value={true} />
          <AppSwitch size="lg" value={true} />
          <AppSwitch size="xl" value={true} />
        </View>
      </View>

      {/* Color Schemes */}
      <View className="space-y-2">
        <Text className="text-lg font-semibold text-typography-800">
          Color Schemes
        </Text>
        <View className="space-y-3">
          <AppSwitch
            colorScheme="primary"
            value={primarySwitch}
            onValueChange={setPrimarySwitch}
            showText
            activeText="Primary"
          />
          <AppSwitch
            colorScheme="success"
            value={successSwitch}
            onValueChange={setSuccessSwitch}
            showText
            activeText="Success"
          />
          <AppSwitch
            colorScheme="warning"
            value={true}
            showText
            activeText="Warning"
          />
          <AppSwitch
            colorScheme="error"
            value={true}
            showText
            activeText="Error"
          />
        </View>
      </View>

      {/* Outline Variant */}
      <View className="space-y-2">
        <Text className="text-lg font-semibold text-typography-800">
          Outline Variant
        </Text>
        <AppSwitch
          variant="outline"
          colorScheme="primary"
          value={outlineSwitch}
          onValueChange={setOutlineSwitch}
          showText
          activeText="Outline"
        />
      </View>

      {/* Disabled State */}
      <View className="space-y-2">
        <Text className="text-lg font-semibold text-typography-800">
          Disabled State
        </Text>
        <AppSwitch
          disabled
          value={disabledSwitch}
          onValueChange={setDisabledSwitch}
          showText
          activeText="Disabled"
        />
      </View>

      {/* Custom Thumb Content */}
      <View className="space-y-2">
        <Text className="text-lg font-semibold text-typography-800">
          Custom Thumb Content
        </Text>
        <AppSwitch
          value={true}
          size="lg"
          renderInsideThumb={() => (
            <View className="w-2 h-2 bg-primary-500 rounded-full" />
          )}
        />
      </View>
    </View>
  );
};

export default AppSwitchExample;
