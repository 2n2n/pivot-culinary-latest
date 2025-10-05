import { useContext, useEffect } from "react";
import { AccountModalContext } from "@/services/account_modal/AccountModalProvider";
import { getAuth, signOut } from "@react-native-firebase/auth";

export const useModal = () => {
  const {
    showModal,
    setShowModal,
    selectedTeam,
    setSelectedTeam,
    accounts,
    setAccounts,
  } = useContext(AccountModalContext);

  useEffect(() => {
    setAccounts([
      {
        id: 1,
        name: "Chicago Bulls",
      },
    ]);
  }, []);

  const _signOut = async () => {
    await signOut(getAuth());
    setShowModal(false);
  };

  return {
    accounts,
    show: showModal,
    setShow: setShowModal,
    team: selectedTeam,
    setTeam: setSelectedTeam,
    signOut: _signOut,
  };
};
