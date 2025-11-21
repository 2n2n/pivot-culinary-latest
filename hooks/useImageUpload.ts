import type { FirebaseStorageTypes } from "@react-native-firebase/storage";
import type { ReactNativeFirebase } from "@react-native-firebase/app";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import { getStorage } from "@react-native-firebase/storage"

export default function useImageUpload(item: ImageItem) {
    //* Note: uploadTask is basically a unchanging state, that holds the upload task for the item.
    //* This will be null if the item has already been uploaded.
    //* instead of going with the useEffect, useState initializer
    //* is utilized to the same effect.
    //! IMPORTANT: The parent component must stay consistent, 
    //! especially when the uploaded item is part of the list of items to be uploaded.
    //! USING react key prop is paramount for this to work.
    const [uploadTask] = useState<FirebaseStorageTypes.Task | null>(() => {
        if (item.uploaded) return null;
        return getStorage().ref(item.storagePath).putFile(item.uri);
    });
    const progressRef = useRef<ProgressRef>({ 
        percent: 0, 
        error: null, 
        finished: item.uploaded ? null : false, 
        cancelled: item.uploaded ? false : false
    });
    const uploadTaskProgressSubscription = useCallback((onProgressChange: () => void) => {
        if (!uploadTask) return () => {};
        const unsubscribe = uploadTask.on("state_changed", 
            snapshot => {
                if (snapshot.state === "cancelled") progressRef.current = { percent: 0, error: null, finished: null, cancelled: true };
                if (snapshot.state === "running") progressRef.current = { 
                    ...progressRef.current, 
                    percent: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
                };
                onProgressChange();
            },
            error => {
                progressRef.current = { ...progressRef.current, error };
                onProgressChange();
            },
            () => {
                progressRef.current = { ...progressRef.current, finished: true };
                onProgressChange();
            }
        );
        return unsubscribe;
    }, [uploadTask, ]);
    const getProgress = useCallback(() => progressRef.current, [uploadTask]);
    // NOTE: useSyncExternalStore is used to sync the firebase storage progress with the UI
    const progress = useSyncExternalStore<ProgressRef>(uploadTaskProgressSubscription, getProgress);
    const cancelUpload = () => {
        if (!uploadTask || progress.cancelled) return;
        progressRef.current = { ...progressRef.current, cancelled: true };
        uploadTask.cancel();
    };
    return { 
        percent: progress.percent, 
        error: progress.error,
        finished: progress.finished,
        cancelled: progress.cancelled,
        cancelUpload
    };
};

type ProgressRef = {
    percent: number;
    // NOTE: finished is null if the item is already uploaded.
    finished: boolean | null;
    cancelled: boolean | null;
    error: ReactNativeFirebase.NativeFirebaseError | null;
}

export type ImageItem = {
    id: string;
    uri: string;
    uploaded: boolean;
    mimeType: string;
    storagePath: string;
};