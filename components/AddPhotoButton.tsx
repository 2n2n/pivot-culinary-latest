import { Actionsheet, ActionsheetBackdrop, ActionsheetContent, ActionsheetDragIndicator, ActionsheetDragIndicatorWrapper, ActionsheetItem, ActionsheetItemText } from "@/components/ui/actionsheet";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";

import { CameraIcon, ImageIcon, ImagePlus } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { Alert, Platform } from "react-native";
import { useState } from "react";

export type ImageAsset = Omit<ImagePicker.ImagePickerAsset, "assetId"> & { assetId: string };

const getCameraPermissionInstruction = () => {
    if (Platform.OS === "ios") return "Please visit Settings > Privacy & Security > Camera \n and allow Pivot Culinary to use the camera";
    else if (Platform.OS === "android") return "Please visit Settings > Application > Pivot Culinary > Permissions \n and allow Pivot Culinary to use the camera";
    else "Please grant permission to access your camera";
};

const getMediaLibraryPermissionInstruction = () => {
    if (Platform.OS === "ios") return "Please visit Settings > Privacy & Security > Media & Apple ID > Photos \n and allow Pivot Culinary to use the photos";
    else if (Platform.OS === "android") return "Please visit Settings > Application > Pivot Culinary > Permissions \n and allow Pivot Culinary to use the photos";
    else "Please grant permission to access your photos";
};

export default function AddPhotoButton({ onPhotoTaken }: { onPhotoTaken: (photos: Array<ImageAsset>) => void }) {
    const [addPhotoActionSheetIsOpen, setAddPhotoActionSheetIsOpen] = useState(false);
    const openAddPhotoActionSheet = () => setAddPhotoActionSheetIsOpen(true);
    const closeAddPhotoActionSheet = () => setAddPhotoActionSheetIsOpen(false);
    const handleAddPhoto = (photos: Array<ImagePicker.ImagePickerAsset> = []) => {
        // NOTE: photos taken with camera do not have an assetId, so we need to generate one
        // REVIEW: There might be a better way to generate unique ids than timestamps
        const sanitizedPhotos = photos.map(photo => {
            if (!photo.assetId) {
                const timestampId = String(Date.now());
                return Object.assign(photo, { assetId: timestampId });
            } 
            else return photo as ImageAsset;
        });
        onPhotoTaken(sanitizedPhotos);
    };
    const takePhoto = async () => {
        closeAddPhotoActionSheet();
        const { status } = await ImagePicker.getCameraPermissionsAsync();
        if (__DEV__) Alert.alert("Camera might function in development for ios simulators", "Please run the app on a physical device");
        if (status !== ImagePicker.PermissionStatus.GRANTED) return Alert.alert("Permission denied", getCameraPermissionInstruction());
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            allowsMultipleSelection: false,
            allowsEditing: false,
            quality: 0.5,
        });
        if (result.canceled) return;
        handleAddPhoto(result.assets);
    };
    const uploadFromGallery = async () => {
        closeAddPhotoActionSheet();
        const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (status !== ImagePicker.PermissionStatus.GRANTED) return Alert.alert("Permission denied", getMediaLibraryPermissionInstruction());
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsMultipleSelection: true,
            allowsEditing: false,
            quality: 0.5,
        });
        if (result.canceled) return;
        if (result.assets.length === 0) return;
        handleAddPhoto(result.assets);
    };
    return <>
        <Button size="lg" variant="outline" className="rounded-full" onPress={openAddPhotoActionSheet}>
            <ButtonIcon as={ImagePlus} className="text-primary-500" />
            <ButtonText>Add Photos</ButtonText>
        </Button>
        <Actionsheet isOpen={addPhotoActionSheetIsOpen} onClose={closeAddPhotoActionSheet}>
            <ActionsheetBackdrop />
            <ActionsheetContent>
                <ActionsheetDragIndicatorWrapper className="my-3">
                    <ActionsheetDragIndicator />
                </ActionsheetDragIndicatorWrapper>
                <ActionsheetItem className="rounded-lg" onPress={takePhoto}>
                    <HStack className="gap-3 items-center h-[40px]">
                        <Icon as={CameraIcon} className="text-primary-500" />
                        <ActionsheetItemText className="text-lg">Take a photo</ActionsheetItemText>
                    </HStack>
                </ActionsheetItem>
                <ActionsheetItem className="rounded-lg" onPress={uploadFromGallery}>
                    <HStack className="gap-3 items-center h-[40px]">
                        <Icon as={ImageIcon} className="text-primary-500" />
                        <ActionsheetItemText className="text-lg">Upload from gallery</ActionsheetItemText>
                    </HStack>
                </ActionsheetItem>
            </ActionsheetContent>
        </Actionsheet>
    </>;
};``