import { useQueryClient } from "@tanstack/react-query";
import { useFocusEffect } from "expo-router";
import React from "react";

// TODO: Use this component for refreshing queries when the screen is focused
export function useRefreshOnFocus() {
  const queryClient = useQueryClient();
  const firstTimeRef = React.useRef(true);

  useFocusEffect(
    React.useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }

      // refetch all stale active queries
      queryClient.refetchQueries({
        queryKey: ["posts"],
        stale: true,
        type: "active",
      });
    }, [queryClient])
  );
}
