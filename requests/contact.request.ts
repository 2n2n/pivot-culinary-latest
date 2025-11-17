import { collection, getFirestore, doc, getDoc } from "@react-native-firebase/firestore";

export const getContactInfo = async (
  phoneNumber: string
): Promise<ContactResponse | null> => {
  const contactsCollection = collection(getFirestore(), "contacts");
  const contactRef = doc(contactsCollection, phoneNumber);
  const contactSnap = await getDoc(contactRef);

  if (contactSnap.exists()) {
    return contactSnap.data() as Promise<ContactResponse | null>;
  } else {
    return null;
  }
};
