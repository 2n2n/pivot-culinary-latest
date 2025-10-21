import captureMaxLength from "./capture-max-length";

const toPHPhoneFormat = (number: string) => {
  if (number.length > 12) {
    number = captureMaxLength(number, 12);
  }

  if (number.length > 2) {
    let formatted = "+63 ";
    const match = number.match(/^(\d{2})(\d{1,4})?(\d{1,3})?(\d{1,3})?$/);
    if (match) {
      formatted += match[2] ? `${match[2]}` : "";
      formatted += match[3] ? `-${match[3]}` : "";
      formatted += match[4] ? `-${match[4]}` : "";
    } else {
      formatted += number;
    }
    return formatted;
  }
  return number;
};

export default toPHPhoneFormat;
