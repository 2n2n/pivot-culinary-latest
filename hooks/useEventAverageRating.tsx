import { getAllFeedbacks } from "@/requests/feedback.request";
import { useQuery } from "@tanstack/react-query";

export default function useEventAverageRating(eventId: number) {
    // TODO: Add refetchng after submitting feedback
    const allFeedbacksQuery = useQuery({
        queryKey: ["all-feedbacks"],
        queryFn: getAllFeedbacks,
        staleTime: 1000 * 60 * 60 * 24, // 1 day in milliseconds
        gcTime: 1000 * 60 * 60 * 24, // 1 day in milliseconds
        enabled: !!eventId,
    });
    const eventAverageRatingQuery = useQuery({
        queryKey: ["event", eventId, "average-rating"],
        queryFn: () => {
            const start = performance.now();
            const feedbacks = allFeedbacksQuery.data?.filter((feedback: any) => feedback.eventId === eventId);
            if (!feedbacks?.length) return null;
            let totalTaste = 0;
            let totalTimeliness = 0;
            let totalServiceQuality = 0;
            let totalPresentation = 0;
            for (const feedback of feedbacks) {
                totalTaste += feedback?.criteria?.taste ?? 0;
                totalTimeliness += feedback?.criteria?.timeliness ?? 0;
                totalServiceQuality += feedback?.criteria?.serviceQuality ?? 0;
                totalPresentation += feedback?.criteria?.presentation ?? 0;
            }
            const total = totalTaste + totalTimeliness + totalServiceQuality + totalPresentation;
            const average = total / 4;
            const end = performance.now();
            console.log(`Got event [${eventId}] average rating in ${(end - start).toFixed(2)} ms`);
            return average;
        },
        staleTime: 1000 * 60 * 60 * 24, // 1 day in milliseconds
        gcTime: 1000 * 60 * 60 * 24, // 1 day in milliseconds
        enabled: !!eventId && !!allFeedbacksQuery.data?.length,
    });
    return eventAverageRatingQuery;
};