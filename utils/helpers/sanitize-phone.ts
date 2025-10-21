const sanitizePhone = (phoneNumber: string) => phoneNumber.replace(/\D/g, "");

export default sanitizePhone;
