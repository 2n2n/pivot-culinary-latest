import { useContext } from "react";
import { AccountModalContext } from "@/services/account_modal/AccountModalProvider";
import { getAuth, signOut } from "@react-native-firebase/auth";

// TODO: Rename to useAccountModal
export const useModal = () => {
  //  TODO: remove this context
  const { showModal, setShowModal, selectedAccount, setSelectedAccount } =
    useContext(AccountModalContext);

  const _signOut = async () => {
    await signOut(getAuth());
    setShowModal(false);
  };

  return {
    show: showModal,
    setShow: setShowModal,
    selectedAccount,
    setSelectedAccount,
    signOut: _signOut,
  };
};
