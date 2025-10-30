import axios from "axios";

export const SITE_ID = 13574;

export const LOCATION_ID_MAPPING = {
  gameday: 31015,
  pivot: 26881,
};

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

export default authenticate;
