export const getAccountLocation = (account: Account) => {
  // Find the custom field where the name (trimmed) is exactly "LOCATION"
  return (
    account?.custom_fields.find(
      (field: CustomField) => field.custom_field_name.trim() === "LOCATION"
    )?.value || "PIVOT"
  ).trim();
};

export const groupByAccount = (accounts: Account[]) => {
  const pivotAccounts: Account[] = [];
  const gamedayAccounts: Account[] = [];

  accounts.forEach((_account: Account) => {
    if (getAccountLocation(_account) === "PIVOT") {
      pivotAccounts.push(_account);
    } else {
      gamedayAccounts.push(_account);
    }
  });

  return [...pivotAccounts, ...gamedayAccounts];
};

// get the inverse theme of the current app.
export const getOtherTheme = (theme: ModeType) => {
  return theme === "light" ? "dark" : "light";
};

/**
 // TODO implement the unit tests for this
 */

/**
 * Removes duplicate items from an array based on a unique identifier.
 * If no identifier function is provided, the items themselves are used for uniqueness.
 *
 * @template T - The type of items in the array.
 * @param {T[]} arr - The input array from which duplicates should be removed.
 * @param {(item: T) => any} [getId=(item) => item] - A function that extracts a unique identifier from an item. Defaults to the item itself.
 * @returns {T[]} A new array containing only unique items.
 *
 * @example
 * // Example with objects
 * const items = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }, { id: 1, name: 'C' }];
 * const uniqueItems = removeDuplicates(items, item => item.id);
 * console.log(uniqueItems); // [{ id: 1, name: 'A' }, { id: 2, name: 'B' }]
 *
 * @example
 * // Example with primitives
 * const numbers = [1, 2, 1, 3];
 * const uniqueNumbers = removeDuplicates(numbers);
 * console.log(uniqueNumbers); // [1, 2, 3]
 */
export const removeDuplicates = <T,>(
  arr: T[] = [],
  getId: (item: T) => unknown = (i) => i
) => {
  if (!Array.isArray(arr))
    throw new Error("Provided argument is not of type Array");
  const idSet = new Set();
  return arr.filter((item) => {
    const itemId = getId(item);
    if (idSet.has(itemId)) return false;
    idSet.add(itemId);
    return true;
  });
};

export const groupByBookings = (events: BookingEvent[] = []) => {
  if (!Array.isArray(events))
    throw new Error("Provided Events is not of type Array");
  const bookings: (Booking & { events: Event[] })[] = [];
  events.forEach((event) => {
    const bookingIndex = bookings.findIndex(
      (booking: Booking) => event.booking.id === booking.id
    );
    const inBookings = bookingIndex > -1;
    if (inBookings) {
      bookings[bookingIndex].events.push(event);
    } else {
      bookings.push({
        ...event.booking,
        events: [event],
      });
    }
  });
  return bookings;
};

// DOCS: Formats a given date string into the "Sun, Nov 9, 2025" format for display in booking cards
export const formatFullDate = (date: string) => {
  if (!date) return "--";
  const d = new Date(date);
  // CHORE: Consider moving to date-fns or dayjs for better localization and edge case handling
  return d.toLocaleDateString(undefined, {
    weekday: "short", // e.g. "Sun"
    month: "short", // e.g. "Nov"
    day: "numeric", // e.g. "9"
    year: "numeric", // e.g. "2025"
  });
};

export const getBEO = (documents: TripleseatDocument[]) => {
  if (!documents) throw new Error("No documents provided");
  if (!Array.isArray(documents))
    throw new Error("The provided documents are not of type Array");
  const [firstDocument] = documents;
  if (!firstDocument) return null;
  const views = firstDocument.views;
  const viewBEO = views.find((view) =>
    view.name.includes("Banquet Event Order")
  );
  return viewBEO;
};

export const findBookingAddress: (custom_fields: CustomField[]) => string = (
  custom_fields: CustomField[]
) => {
  return (
    custom_fields.find((field: CustomField) => {
      return field.custom_field_slug === "cf_offsite_location";
    })?.value || "N/A"
  ).trim();
};
