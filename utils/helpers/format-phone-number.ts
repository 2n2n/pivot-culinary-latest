import sanitizePhone from "./sanitize-phone";
import detectAreaCode from "./detect-area-code";
import toUSPhoneFormat from "./to-us-phone-format";
import toPHPhoneFormat from "./to-php-phone-format";
import captureMaxLength from "./capture-max-length";

const formatPhoneNumber = (number: string, maxLength: number = 13) => {
  number = sanitizePhone(number);
  const phoneFormat = detectAreaCode(number);

  if (phoneFormat === "US") {
    return toUSPhoneFormat(number);
  } else if (phoneFormat === "PH") {
    return toPHPhoneFormat(number);
  } else {
    if (number.length > maxLength) {
      return captureMaxLength(number, maxLength);
    } else {
      return number;
    }
  }
};

export default formatPhoneNumber;
