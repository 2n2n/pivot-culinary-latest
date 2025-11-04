import { createContext, useEffect, useState } from "react";
import useBookings from "@/hooks/useBookings";

export const AccountModalContext = createContext<{
  accounts: Account[];
  setAccounts: (accounts: Account[]) => void;
  showModal: boolean;
  setShowModal: (isOpen: boolean) => void;
  selectedAccount: Account | null;
  setSelectedAccount: (account: Account | null) => void;
}>({
  accounts: [],
  setAccounts: () => {},
  showModal: false,
  setShowModal: () => {},
  selectedAccount: null,
  setSelectedAccount: (account: Account | null) => {},
});

export const AccountModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // this state will handle all the accounts that are grouped
  // this is used in the AccountModal component.
  const [accounts, setAccounts] = useState<Account[]>([]);

  const [showModal, setShowModal] = useState(false);

  // this will identify which account was selected throughout the app.
  // this includes the setSelectedAccount from onSubmitOTP from auth.tsx
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  useBookings(selectedAccount);

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
