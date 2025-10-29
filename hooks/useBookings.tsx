import { getAccountLocation } from "@/helpers";
import { getAccountBookings } from "@/requests/bookings.request";
import { useQuery } from "@tanstack/react-query";

const useBookings = (account: Account | null) => {
  const bookingsQuery = useQuery({
    queryKey: ["bookings", getAccountLocation(account as Account), account?.id],
    queryFn: async () => {
      const bookings = await getAccountBookings(account as Account);
      return bookings;
    },
    staleTime: 1000 * 60 * 60 * 24, // 1 day in milliseconds
    gcTime: 1000 * 60 * 60 * 24, // 1 day in milliseconds
    // DOCS: This hook will automatically refetch when the account id changes due to the queryKey structure.
  });

  return bookingsQuery;
};

export default useBookings;
