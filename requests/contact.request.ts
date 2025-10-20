import firestore from "@react-native-firebase/firestore";

export const getContactInfo = async (
  phoneNumber: string
): Promise<ContactResponse | null> => {
  const contactsCollection = firestore().collection("contacts");
  const contactRef = contactsCollection.doc(phoneNumber);
  const contactSnap = await contactRef.get();

  if (contactSnap.exists()) {
    return contactSnap.data() as Promise<ContactResponse | null>;
  } else {
    return null;
  }
};
