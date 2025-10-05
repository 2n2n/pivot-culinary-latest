import { createContext, useEffect, useState } from "react";

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
  const [showModal, setShowModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState("Chicago Bulls");
  const [accounts, setAccounts] = useState<any[]>([]);

  // TODO: initiate fetching of users by account type

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
