import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { useQuery } from "@tanstack/react-query";
import useContacts from "./useContacts";
import getAccount from "@/requests/acccount.request";

const useAccounts = (user: FirebaseAuthTypes.User) => {
  const { data: userContacts } = useContacts(user);

  const AccountsQuery = useQuery({
    queryKey: ["accounts", user?.phoneNumber],
    queryFn: async () => {
      // CHORE: Add validation to ensure `user` is defined before using it in `useContacts` and queryKey.
      // We are no longer passing `null`, which resolves the type error, but ensure the parent only calls this hook with a valid user.
      const accounts = await Promise.all(
        userContacts?.map((contact: Contact) => {
          return getAccount(contact.account_id);
        }) ?? []
      );
      return accounts;
    },
    enabled: !!userContacts,
  });

  return AccountsQuery;
};

export default useAccounts;
