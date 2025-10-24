import { getContactInfo } from "@/requests/contact.request";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { useQuery } from "@tanstack/react-query";

const useContacts = (user: FirebaseAuthTypes.User) => {
  const contactsQuery = useQuery({
    queryKey: ["contacts", user?.phoneNumber],
    queryFn: async () => {
      // TODO: Implement fetching of Account information.
      if (user?.phoneNumber) {
        const contactData = await getContactInfo(user.phoneNumber);
        if (contactData && contactData?.accounts) {
          return contactData.accounts;
        }
      }
      return [];
    },
    // This means the query will only run if user?.phoneNumber is truthy (not null/undefined/empty string)
    enabled: !!user?.phoneNumber,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });

  return contactsQuery;
};

export default useContacts;
