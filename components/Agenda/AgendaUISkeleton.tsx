import { Skeleton } from "@/components/ui/skeleton";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";

export default function AgendaUISkeleton() {
    return <>
        <VStack className="gap-4 pt-0 pb-4 px-4 bg-white">
            <HStack className="justify-between">
                <Skeleton className="h-[11px] w-[80px] rounded-full"></Skeleton>
                <Skeleton className="h-[11px] w-[80px] rounded-full"></Skeleton>
            </HStack>
            <HStack className="justify-evenly">
                <SelectionItemSkeleton />
                <SelectionItemSkeleton />
                <SelectionItemSkeleton />
                <SelectionItemSkeleton />
                <SelectionItemSkeleton />
                <SelectionItemSkeleton />
                <SelectionItemSkeleton />
            </HStack>
        </VStack>
        <VStack className="flex-1 gap-8 overflow-hidden pb-0 p-4">
            <ContentItemSkeleton>
                <Skeleton className="h-[100px] w-full rounded-lg"></Skeleton>
                <Skeleton className="h-[70px] w-full rounded-lg"></Skeleton>
                <Skeleton className="h-[90px] w-full rounded-lg"></Skeleton>
            </ContentItemSkeleton>
            <ContentItemSkeleton>
                <Skeleton className="h-[80px] w-full rounded-lg"></Skeleton>
            </ContentItemSkeleton>
            <ContentItemSkeleton>
                <Skeleton className="h-[75px] w-full rounded-lg"></Skeleton>
                <Skeleton className="h-[120px] w-full rounded-lg"></Skeleton>
            </ContentItemSkeleton>
        </VStack>
    </>
}

export const ContentItemSubSkeleton = () => <>
    <Skeleton className="h-[100px] w-full rounded-lg"></Skeleton>
    <Skeleton className="h-[70px] w-full rounded-lg"></Skeleton>
    <Skeleton className="h-[90px] w-full rounded-lg"></Skeleton>
</>

export const ContentItemSkeleton = ({ children }: { children: React.ReactNode }) => <HStack className="gap-2">
    <Skeleton className="h-[80px] w-[58px] rounded-lg"></Skeleton>
    <VStack className="flex-1 gap-2">
        {children}
    </VStack>
</HStack>

const SelectionItemSkeleton = () => <VStack className="gap-2">
    <Skeleton className="h-[11px] w-[32px] rounded-full"></Skeleton>
    <Skeleton className="h-[32px] w-[32px] rounded-full"></Skeleton>
</VStack>