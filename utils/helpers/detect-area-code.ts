const detectAreaCode = (phoneNumber: string = "") => {
  phoneNumber = phoneNumber.replace("+", "");
  if (/^63/.test(phoneNumber)) return "PH";
  if (/^1/.test(phoneNumber)) return "US";
  return false;
};

export default detectAreaCode;
