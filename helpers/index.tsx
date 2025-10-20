export const getAccountLocation = (account: Account) => {
  // Find the custom field where the name (trimmed) is exactly "LOCATION"
  return (
    account?.custom_fields.find(
      (field: CustomField) => field.custom_field_name.trim() === "LOCATION"
    )?.value || "PIVOT"
  ).trim();
};
