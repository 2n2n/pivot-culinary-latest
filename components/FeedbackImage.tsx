import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import useImageUpload, { ImageItem } from "@/hooks/useImageUpload";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Box } from "@/components/ui/box";

import { X } from "lucide-react-native";
import { Alert } from "react-native";
import { Image } from "expo-image";
import { useEffect } from "react";

export default function FeedbackImage({ item, onRemovePhoto, onCompletedUpload }: FeedbackImageProps) {
    const { percent, finished, error, cancelUpload } = useImageUpload(item);
    const handleDismissUpload = () => {
      if (onRemovePhoto) onRemovePhoto();
      if (!item.uploaded) cancelUpload();
    };
    useEffect(() => {
      if (finished === null) return;
      if (finished && onCompletedUpload) onCompletedUpload();
    }, [finished, onCompletedUpload]);
    useEffect(() => {
      if (!error) return;
      // TODO: Might trigger multiple times when mutiple image uploads fail
      Alert.alert("Failed to upload one of the images", "Please try again");
      if (onRemovePhoto) onRemovePhoto();
    }, [error, onRemovePhoto]);
    return <Box key={item.id} className="relative rounded-lg overflow-hidden bg-gray-400">
        <Image
            source={{ uri: item.uri }}
            alt="Uploaded Image"
            style={{
            height: "100%",
            minWidth: 120,
            aspectRatio: "auto"
            }}
        />
        <Button
            size="sm"
            className="rounded-full px-2 py-1 bg-black/60 absolute top-1 left-1"
            onPress={handleDismissUpload}
        >
        <ButtonIcon as={X} className="text-white" />
        </Button>
        {!item.uploaded && (
            <Center className="flex-1 absolute inset-0 px-4 bg-black/60">
                <Progress value={percent}>
                    <ProgressFilledTrack />
                </Progress>
            </Center>
        )}
    </Box>
};

type FeedbackImageProps = {
    item: ImageItem
    onCompletedUpload?: () => void
    onRemovePhoto?: () => void
};