const captureMaxLength = (input: string, maxLen: number) => {
  if (maxLen > input.length) return input;
  const regex = new RegExp(`^(\\d{${maxLen}})`);
  const captured = input.match(regex);
  return captured?.[0] || "";
};

export default captureMaxLength;
