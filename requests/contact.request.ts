import firestore from "@react-native-firebase/firestore";

export const getContactInfo: (phoneNumber: string) => any | null = async (
  phoneNumber
) => {
  const contactsCollection = firestore().collection("contacts");
  const contactRef = contactsCollection.doc(phoneNumber);
  const contactSnap = await contactRef.get();

  if (contactSnap.exists()) {
    return contactSnap.data();
  } else {
    return null;
  }
};
