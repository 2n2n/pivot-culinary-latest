import { addWeeks, format, subDays } from "date-fns";
import authenticate, { SITE_ID } from ".";
import { AxiosInstance } from "axios";

export const getEvents = async (
  _accountId: number,
  page = 1,
  _request: AxiosInstance | null = null
) => {
  const request = _request || (await authenticate());
  const now = new Date();
  const startDate = format(subDays(now, 10), "P");
  const endDate = format(addWeeks(now, 6), "P");
  const params = {
    site_id: SITE_ID.toString(),
    account_id: _accountId.toString(),
    page: page.toString(),
    order: "booking_start_date",
    sort_direction: "desc",
    status: "definite",
    event_end_date: endDate,
    event_start_date: startDate,
    active: "true",
  };

  const urlParams = new URLSearchParams(params).toString();
  const events = await request
    .get(`v1/events/search.json?${urlParams}`)
    .catch((err) => console.error(err));
  return events as EventRequestResponse;
};

export const getEventsFromOtherPages = async (
  _request: AxiosInstance,
  _accountId: string,
  total_pages: number
) => {
  const pagesRequest = [];
  total_pages = Math.min(total_pages, 10);
  for (let page = 2; page <= total_pages; page++) {
    // CHORE: Add TypeScript types for better type safety
    // CHORE: Add error handling for this API call
    // CHORE: Consider using a more descriptive variable name
    pagesRequest.push(
      getEvents(_accountId, page, _request)
        .then((response) => {
          if (
            response &&
            response.data &&
            response.data.data &&
            Array.isArray(response.data.data.results)
          ) {
            return response.data.data.results as Booking[];
          }
          // CHORE: Handle edge cases in this function
          return [];
        })
        .catch((err) => {
          console.error("Failed to fetch events for page", page, err);
          return [];
        })
    );
  }

  const results = await Promise.all(pagesRequest);
  return results.flat();
};
