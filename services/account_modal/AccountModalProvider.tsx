import { createContext, useContext, useEffect, useState } from "react";
import useBookings from "@/hooks/useBookings";
import { ThemeLoaderScreenContext } from "../theme_loader_screen/ThemeLoaderScreenProvider";

export const AccountModalContext = createContext<{
  showModal: boolean;
  setShowModal: (isOpen: boolean) => void;
  selectedAccount: Account | null;
  setSelectedAccount: (account: Account | null) => void;
}>({
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
  const [showModal, setShowModal] = useState(false);

  // this will identify which account was selected all througout the app.
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  useBookings(selectedAccount);

  return (
    <AccountModalContext.Provider
      value={{
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
