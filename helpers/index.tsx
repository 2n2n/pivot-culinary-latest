import { format } from "date-fns-tz";

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

export const formatCurrency = (amount: number, currency: string = "USD") => {
  console.log(amount);
  if (!amount) return "--";
  else
    return Number(amount).toLocaleString("en-US", {
      style: "currency",
      currency: currency,
    });
};

export const parseDate = (
  unknownDateLike: unknown = null
): Date | undefined => {
  if (!unknownDateLike) return;
  if (["number", "string"].includes(typeof unknownDateLike)) {
    if (
      typeof unknownDateLike === "number" &&
      (unknownDateLike < 0 || isNaN(unknownDateLike))
    )
      return;
    const toDate = new Date(unknownDateLike as number | string);
    if (isNaN(toDate.getTime())) return;
    else return toDate;
  }
  if (typeof unknownDateLike === "object") {
    const { seconds } = unknownDateLike as Timestamp;
    const { getTime } = unknownDateLike as Date;
    if (!seconds && !getTime) return;
    if (seconds) return new Date(seconds * 1000);
    if (getTime && typeof getTime === "function")
      return unknownDateLike as Date;
  }
  return;
};

export const dateToLocalFormat = (
  date: string | number | Date,
  _format: string,
  timeZone: string = "US/Mountain"
) => {
  if (!_format) throw new Error("No date format is provided");
  const parsedDate = parseDate(date);
  if (!parsedDate) throw new Error("The date provided is not parseable");
  return format(parsedDate, _format, { timeZone });
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

export const getStorageFilePath = (id: string, mimeType: string) => {
  let extension;
  if (mimeType === "image/png") extension = "png";
  else extension = "jpg";
  return `/tmp/feedbacks/${id}.${extension}`;
}

type Timestamp = {
  seconds: number;
  nanoseconds: number;
};
// list of error messages are found here https://firebase.google.com/docs/reference/js/auth#autherrorcodes
export const translateError = (errorMessage: string) => {
  switch (errorMessage) {
    case "auth/network-request-failed":
      return "Unable to login. Please check your internet connection and try again.";
    case "auth/invalid-phone-number":
      return "Your phone number is invalid.";
    case "auth/operation-not-allowed":
    case "auth/app-not-authorized":
      return "Your app is not authorized. Please contact the developer.";
    case "auth/too-many-requests":
      return "Your number was temporarily blocked due to unusual activity. Try again later.";
    case "auth/user-disabled":
      return "Your account was suspended. Please contact Pivot Culinary.";
    case "auth/invalid-verification-code":
      return "You have entered an invalid OTP code. Please try again.";
    case "auth/captcha-check-failed":
    case "auth/recaptcha-not-enabled":
    case "auth/missing-recaptcha-token":
    case "auth/invalid-recaptcha-token":
    case "auth/invalid-recaptcha-action":
    case "auth/missing-recaptcha-version":
    case "auth/invalid-recaptcha-version":
      return "Captcha check failed. Please try again.";
    case "auth/code-expired":
      return "Your OTP code has expired. Please try again and request a new code.";
    default:
      return "An unexpected error has occurred. Please try again later.";
  }
};
