import useEventAverageRating from "@/hooks/useEventAverageRating";
import StarRating from "@/components/StarRating";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";

import { ActivityIndicator } from "react-native";
import { Box } from "@/components/ui/box";

export default function AgendaEventCardStarRating({ eventId }: { eventId: number }) {
    const eventAverageRatingQuery = useEventAverageRating(eventId);
    const rating = eventAverageRatingQuery?.data;
    if (!eventId) return null;
    if (eventAverageRatingQuery.isFetching) return <ActivityIndicator />;
    // NOTE: Placeholder box, will break layout if the expected
    // behavior is to render nothing when the rating is not available
    if (rating === null || rating === undefined) return <Box />;
    return <HStack className="gap-2">
        <Text className="text-sm font-medium text-pivot-blue">{rating.toFixed(2)}</Text>
        <StarRating rating={rating} disabled={true} size={18} spacing={4} />
    </HStack>;
}