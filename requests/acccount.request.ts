import axios from "axios";
import crashlytics from "@react-native-firebase/crashlytics";

const SITE_ID = 13574;

const authenticate = async () => {
  const sessionData = await axios
    .post("https://api.tripleseat.com/oauth/token", {
      client_id: "wrcH2Ce52vzLooR3zhqYsAoitBqQFAPmrFdeXHkv",
      client_secret: "Jaz4db8L1VeygP3WqIDd976A4zTH3sQ9yayH3gOY",
      grant_type: "client_credentials",
    })
    .then(({ data }) => data)
    .catch((err) => {
      console.error(err);
      return err;
    });

  return axios.create({
    baseURL: "https://api.tripleseat.com/",
    headers: {
      Authorization: `Bearer ${sessionData.access_token}`,
    },
    timeout: 25000,
  });
};

const getAccount = async (accountId: number): Promise<AccountObject> => {
  const request = await authenticate();
  return await request
    .get(`v1/accounts/${accountId}.json?site_id=${SITE_ID}`)
    .then(({ data }) => data.account)
    .catch((err) => {
      crashlytics().recordError(err);
    });
};

export default getAccount;
