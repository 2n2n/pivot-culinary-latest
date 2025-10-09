import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthContext } from "@/services/auth/AuthProvider";
// Use TanStack Query to cache the getContactInfo function from contact.request.ts
import { useQuery } from "@tanstack/react-query";
import { getContactInfo } from "@/requests/contact.request";

export const AccountModalContext = createContext<{
  showModal: boolean;
  setShowModal: (isOpen: boolean) => void;
  selectedAccount: number | null;
  setSelectedAccount: (account_id: number | null) => void;
  accounts: Account[];
  setAccounts: (accounts: Account[]) => void;
}>({
  showModal: false,
  setShowModal: () => {},
  selectedAccount: null,
  setSelectedAccount: (account_id: number | null) => {},
  accounts: [],
  setAccounts: () => {},
});

export const AccountModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<number | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);

  // TODO: improve implementation using tanstack useQuery for caching the accounts.

  // Call useQuery at the top level of  the component
  const {
    data: contactInfo,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["contactInfo", user?.phoneNumber],
    queryFn: () =>
      user?.phoneNumber ? getContactInfo(user.phoneNumber) : null,
    // This means the query will only run if user?.phoneNumber is truthy (not null/undefined/empty string)
    enabled: !!user?.phoneNumber,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });

  useEffect(() => {
    if (accounts.length > 0) {
      setSelectedAccount(accounts[0].account_id);
    }
  }, [accounts]);

  useEffect(() => {
    if (contactInfo && contactInfo?.accounts) {
      const { accounts }: { accounts: Account[] } = contactInfo;
      setAccounts(accounts);
    }
  }, [contactInfo]);

  return (
    <AccountModalContext.Provider
      value={{
        accounts,
        setAccounts,
        showModal,
        setShowModal,
        selectedAccount,
        setSelectedAccount,
      }}
    >
      {children}
    </AccountModalContext.Provider>
  );
};
