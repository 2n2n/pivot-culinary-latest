import { getAccountLocation } from "@/helpers";
import authenticate, { LOCATION_ID_MAPPING, SITE_ID } from ".";
import { addWeeks, format, subDays } from "date-fns";
import { AxiosInstance, AxiosResponse } from "axios";

/**
 * DOCS: Returns all bookings for specified locations based on the Tripleseat location ID mapping.
 *
 * Use this function to retrieve all bookings (across locations) using Tripleseat IDs,
 * suitable for admin/overview purposes. The implementation should call the Tripleseat API
 * with appropriate location IDs to fetch all relevant bookings.
 *
 * @returns {Promise<TripleseatResponse<Booking>>} A promise resolving to all bookings for the mapped locations.
 */
export const getBookings = async (
  _account: Account,
  page: number = 1,
  _request: AxiosInstance | null = null
): Promise<TripleseatResponse<Booking>> => {
  const request = _request || (await authenticate());
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
    page: page.toString(),
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
  let bookings: AxiosResponse<TripleseatResponse<Booking>>;
  try {
    bookings = await request.get(`v1/bookings/search.json?${urlParams}`);
    return bookings.data;
  } catch (err) {
    console.error(err);
    return {
      total_pages: 1,
      results: [] as unknown as Booking[],
    } as TripleseatResponse<Booking>;
  }
};

/**
 * DOCS: Retrieves bookings from subsequent pages by fetching booking data for each page greater than 1.
 * The result is an array of Promises, each resolving to a TripleseatResponse<Booking>.
 * This is useful for paginated loading; each entry of the resulting array corresponds to bookings from a particular page.
 * If a request fails, an empty result is returned for that page and the error is logged.
 *
 * @param _request AxiosInstance to be used for the requests
 * @param account The account whose bookings are being queried
 * @param total_pages The total number of pages to attempt to fetch (up to a capped maximum)
 * @returns {Promise<TripleseatResponse<Booking>[]>} A promise resolving to an array of TripleseatResponse<Booking> for each page
 */

export const getBookingsFromOtherPages = (
  _request: AxiosInstance,
  account: Account,
  total_pages: number
): Promise<TripleseatResponse<Booking>[]> => {
  const pagesRequest: Promise<TripleseatResponse<Booking>>[] = [];
  total_pages = Math.min(total_pages, 10);
  for (let page = 2; page <= total_pages; page++) {
    pagesRequest.push(
      getBookings(account, page, _request)
        .then((response) => {
          if (Array.isArray(response.results)) {
            return response as TripleseatResponse<Booking>;
          }
          // CHORE: Handle edge cases in this function
          return {
            total_pages: 0,
            results: [] as unknown as Booking[],
          } as TripleseatResponse<Booking>;
        })
        .catch((err) => {
          console.error("Failed to fetch events for page", page, err);
          return {
            total_pages: 0,
            results: [] as unknown as Booking[],
          } as TripleseatResponse<Booking>;
        })
    );
  }
  return Promise.all(pagesRequest);
};

/**
 * DOCS: Filters all bookings belonging to a specific account.
 * Given an array of bookings and an account id, returns only the bookings that are associated with the given account.
 * Useful for retrieving bookings scoped to a user/account in client-side or after fetching all bookings.
 *
 * @param bookings Array of Booking objects to filter
 * @param accountId The id of the account whose bookings you want to retrieve
 * @returns {Booking[]} Array of Booking objects belonging to the specified account
 */

export const getAccountBookings = async (
  account: Account
): Promise<Booking[]> => {
  // get the first booking batch
  const bookings: Booking[] = [];

  const request = await authenticate();
  const firstBookings = await getBookings(account, 1, request);
  bookings.push(...firstBookings.results);
  // if booking batch pages is more than 1, call getBookingsFromOtherPages
  if (firstBookings.total_pages > 1) {
    const otherBookings = await getBookingsFromOtherPages(
      request,
      account,
      firstBookings.total_pages
    );
    return [
      ...bookings,
      otherBookings.map((response) => {
        if (response && Array.isArray(response.results)) {
          return response.results as Booking[];
        }
        return [] as Booking[];
      }),
    ].flat() as Booking[];
  }
  return bookings.filter((booking) => booking.account.id === account.id);
};

export const getBookingsById = async (bookingId: string): Promise<Booking> => {
  const request = await authenticate();
  const params = {
    booking: SITE_ID.toString(),
  };

  // CHORE: Fix type error by ensuring all params are strings
  const paramsForSearch = Object.fromEntries(
    Object.entries(params).map(([k, v]) => [k, String(v)])
  );

  const urlParams = new URLSearchParams(paramsForSearch).toString();

  try {
    const response: { data: { booking: Booking } } = await request(
      `https://api.tripleseat.com/v1/bookings/${bookingId}?${urlParams}`
    );

    return response.data.booking as Booking;
  } catch (error) {
    console.log("🚀 ~ getBookingsById ~ error:", error);
    return {} as Booking;
  }
};
