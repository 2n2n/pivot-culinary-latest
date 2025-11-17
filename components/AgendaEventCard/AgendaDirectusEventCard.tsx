import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from "@/components/ui/modal";
import { Button, ButtonText } from "@/components/ui/button";
import { Icon, CloseIcon } from "@/components/ui/icon";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";

import { Pressable } from "react-native";
import { format } from "date-fns";
import { useState } from "react";

const FALLBACK_DESCRIPTION = "No additional details are available for this event yet.";

export default function AgendaDirectusEventCard({ event }: { event: DirectusEvent }) {
  const [eventDialogVisible, setEventDialogVisible] = useState(false);
  const closeDialog = () => setEventDialogVisible(false);
  const startDateWeekday = format(event.start_date, "EEE");
  const startDateMonth = format(event.start_date, "MMMM d");
  const description = event.description ?? FALLBACK_DESCRIPTION;
  return (
    <>
      <Pressable onPress={() => setEventDialogVisible(true)}>
        <VStack className="bg-white rounded-lg p-3 w-full gap-1">
          <HStack className="justify-between items-center">
            <Text className="text-pivot-blue text-sm">
              {event.event_start_time} - {event.event_end_time}
            </Text>
          </HStack>
          <Text className="text-pivot-blue font-bold">{event.name}</Text>
        </VStack>
      </Pressable>

      <Modal isOpen={eventDialogVisible} onClose={closeDialog} size="sm">
        <ModalBackdrop />
        <ModalContent className="w-11/12 max-w-sm">
          <ModalHeader className="flex-row items-start justify-between my-0">
            <Text className="text-xs text-pivot-blue">
                {startDateWeekday} | {startDateMonth} | {event.event_start_time} - {event.event_end_time}
            </Text>
            <ModalCloseButton onPress={closeDialog}>
              <Icon as={CloseIcon} className="text-slate-500" size="md" />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody className="mt-0">
            <Text className="text-2xl font-semibold text-black">
              {event.name}
            </Text>
            <Text className="text-base text-slate-600 mt-3">{description}</Text>
          </ModalBody>
          <ModalFooter className="flex flex-row justify-end">
            <Button variant="outline"
              onPress={closeDialog}
            >
              <ButtonText>Close</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
