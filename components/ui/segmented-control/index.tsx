import React, { useState } from "react";
import { Pressable } from "react-native";
import { Box } from "../box";
import { Text } from "../text";
import { HStack } from "../hstack";

interface SegmentedControlProps {
  options: Array<{
    id: string;
    label?: string;
    icon?: React.ReactNode;
    backgroundColor: string;
    textColor: string;
  }>;
  selectedId?: string;
  onSelectionChange?: (selectedId: string) => void;
  className?: string;
}

export function SegmentedControl({
  options,
  selectedId,
  onSelectionChange,
  className,
}: SegmentedControlProps) {
  const [internalSelectedId, setInternalSelectedId] = useState(
    selectedId || options[0]?.id
  );

  const currentSelectedId = selectedId || internalSelectedId;

  const handlePress = (optionId: string) => {
    if (selectedId === undefined) {
      setInternalSelectedId(optionId);
    }
    onSelectionChange?.(optionId);
  };

  return (
    <HStack className={`${className || ""}`}>
      {options.map((option, index) => {
        const isSelected = currentSelectedId === option.id;
        const isFirst = index === 0;
        const isLast = index === options.length - 1;

        return (
          <Pressable
            key={option.id}
            onPress={() => handlePress(option.id)}
            className="flex-1"
          >
            <Box
              className={`
                ${option.backgroundColor}
                ${isFirst ? "rounded-l-full" : ""}
                ${isLast ? "rounded-r-full" : ""}
                ${!isFirst && !isLast ? "rounded-none" : ""}
                ${isFirst && !isLast ? "-mr-px" : ""}
                ${!isFirst && isLast ? "-ml-px" : ""}
                ${!isFirst && !isLast ? "-mx-px" : ""}
                px-6 py-3 flex-row items-center justify-center
                ${isSelected ? "border-2 border-dashed border-blue-400" : ""}
              `}
            >
              {option.icon && <Box className="mr-2">{option.icon}</Box>}
              {option.label && (
                <Text className={`${option.textColor} font-semibold`}>
                  {option.label}
                </Text>
              )}
            </Box>
          </Pressable>
        );
      })}
    </HStack>
  );
}

