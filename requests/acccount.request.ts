import authenticate, { SITE_ID } from ".";
import crashlytics from "@react-native-firebase/crashlytics";

const getAccount = async (accountId: number): Promise<Account> => {
  const request = await authenticate();
  return await request
    .get(`v1/accounts/${accountId}.json?site_id=${SITE_ID}`)
    .then(({ data }) => data.account)
    .catch((err) => {
      crashlytics().recordError(err);
    });
};

export default getAccount;
