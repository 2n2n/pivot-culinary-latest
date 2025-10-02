import StarRating, { StarElement } from "@/components/StarRating";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";

import { configureReanimatedLogger, ReanimatedLogLevel, runOnJS, runOnUI, useDerivedValue, useSharedValue } from "react-native-reanimated";
import { useCallback, useEffect, useRef } from "react";

type FeedbackStarRatingSectionProps = {
    categoryRatings: Record<string, number>,
    onChangeRating: (categoryRatings: Record<string, number>) => void,
};

const DEFAULT_RATING = 0;
const MAX_RATING = 5;
const OVERALL_RATING_SIZE = 45;

configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false,
});

export default function FeedbackStarRatingSection(props: FeedbackStarRatingSectionProps) {
    const categoryRatings = useSharedValue<Record<string, number>>(props.categoryRatings || {});
    const debounceRef = useRef<number | null>(null);
    const categories = Object.keys(props.categoryRatings);
    const overallRating = useDerivedValue(() => {
        const sum = Object.values(categoryRatings.value).reduce((acc, curr) => acc + curr, 0);
        if (sum === 0) return 0;
        return sum / categories.length;
    });
    const isDragging = useSharedValue(false);
    const createRatingChangeHandler = (category: string) => (rating: number) => categoryRatings.set(prev => ({ ...prev, [category]: rating }));
    const handleChange = useCallback((categoryRatings: Record<string, number>) => {
        if (!props.onChangeRating) return;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => props.onChangeRating(categoryRatings), 300);
    }, [props.onChangeRating]);
    useEffect(() => {
        runOnUI(() => {
            'worklet';
            categoryRatings.addListener(1, categoryRatings => runOnJS(handleChange)(categoryRatings));
        })();
        return () => {
            runOnUI(() => {
                'worklet';
                categoryRatings.removeListener(1);
            })();
        };
    }, [handleChange]);
    return (
        <VStack>
            <HStack className="gap-3 relative self-center">
                {Array.from({ length: MAX_RATING }).map((_, i) => (
                    <StarElement key={i} index={i} size={OVERALL_RATING_SIZE} rating={overallRating} dragging={isDragging} />
                ))}
            </HStack>
            {categories.map(category => <HStack key={category} className="items-center justify-between">
                <Text className="font-bold capitalize">{category}</Text>
                <StarRating 
                    rating={categoryRatings.value[category] || DEFAULT_RATING} 
                    onChange={createRatingChangeHandler(category)} 
                />
            </HStack>)}
        </VStack>
    );
}