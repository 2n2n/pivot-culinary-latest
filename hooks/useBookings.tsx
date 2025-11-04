import { getAccountBookings } from "@/requests/bookings.request";
import { useQuery } from "@tanstack/react-query";

const useBookings = (account: Account | null) => {
  const bookingsQuery = useQuery({
    queryKey: ["bookings", account?.id?.toString()],
    queryFn: async () => {
      const bookings = await getAccountBookings(account as Account);
      return bookings;
    },
    enabled: !!account?.id,
    staleTime: 1000 * 60 * 60 * 24, // 1 day in milliseconds
    gcTime: 1000 * 60 * 60 * 24, // 1 day in milliseconds
  });

  return bookingsQuery;
};

export default useBookings;
