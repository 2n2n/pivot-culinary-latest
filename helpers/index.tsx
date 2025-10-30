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
