import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "@/services/auth/AuthProvider";

export const AccountModalContext = createContext<{
  showModal: boolean;
  setShowModal: (isOpen: boolean) => void;
  selectedTeam: string;
  setSelectedTeam: (team: string) => void;
  accounts: any[];
  setAccounts: (accounts: any[]) => void;
}>({
  showModal: false,
  setShowModal: () => {},
  selectedTeam: "",
  setSelectedTeam: () => {},
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
  const [selectedTeam, setSelectedTeam] = useState("Chicago Bulls");
  const [accounts, setAccounts] = useState<any[]>([]);

  // TODO: improve implementation using tanstack useQuery for caching the accounts.
  useEffect(() => {
    console.log("user: call fetch of accounts here.");
  }, [user]);
  return (
    <AccountModalContext.Provider
      value={{
        accounts,
        setAccounts,
        showModal,
        setShowModal,
        selectedTeam,
        setSelectedTeam,
      }}
    >
      {children}
    </AccountModalContext.Provider>
  );
};
