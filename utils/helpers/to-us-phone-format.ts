import captureMaxLength from "./capture-max-length";

const toUSPhoneFormat = (number: string) => {
  if (number.length > 11) {
    number = captureMaxLength(number, 11);
  }
  if (number.length > 2) {
    let formatted = "+1";
    const match = number.match(/^(\d{1})(\d{1,3})?(\d{1,3})?(\d{1,4})?$/);
    if (match) {
      formatted += match[2] ? `-${match[2]}` : "";
      formatted += match[3] ? `-${match[3]}` : "";
      formatted += match[4] ? `-${match[4]}` : "";
    } else {
      formatted += number;
    }
    return formatted;
  }
  return number;
};

export default toUSPhoneFormat;
