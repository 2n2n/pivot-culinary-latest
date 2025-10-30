import { getAccountLocation } from "@/helpers";
import { SITE_ID, LOCATION_ID_MAPPING } from "@/requests";
import { getAccountBookings } from "@/requests/bookings.request";
import { useQuery } from "@tanstack/react-query";
import { format, subDays, addWeeks } from "date-fns";

const createQueryParameter = (_account: Account) => {
  const now = new Date();
  const startDate = format(subDays(now, 10), "P");
  const endDate = format(addWeeks(now, 6), "P");
  const params = {
    site_id: SITE_ID.toString(),
    location_ids:
      LOCATION_ID_MAPPING[
        getAccountLocation(_account)
          .replace(" ", "")
          .toLocaleLowerCase() as keyof typeof LOCATION_ID_MAPPING
      ],
    order: "booking_start_date",
    sort_direction: "desc",
    status: "definite",
    booking_end_date: endDate,
    booking_start_date: startDate,
  };

  // CHORE: Fix type error by ensuring all params are strings
  const paramsForSearch = Object.fromEntries(
    Object.entries(params).map(([k, v]) => [k, String(v)])
  );

  const urlParams = new URLSearchParams(paramsForSearch).toString();
};
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
