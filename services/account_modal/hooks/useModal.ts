import { useContext, useEffect } from "react";
import { AccountModalContext } from "@/services/account_modal/AccountModalProvider";
import { getAuth, signOut } from "@react-native-firebase/auth";

export const useModal = () => {
  const {
    showModal,
    setShowModal,
    selectedAccount,
    setSelectedAccount,
    accounts,
  } = useContext(AccountModalContext);

  const _signOut = async () => {
    await signOut(getAuth());
    setShowModal(false);
  };

  return {
    accounts,
    show: showModal,
    setShow: setShowModal,
    selectedAccount,
    setSelectedAccount,
    signOut: _signOut,
  };
};
