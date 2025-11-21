import { average, getFirestore, getAggregateFromServer, getDocs, query, where, collection, Timestamp } from "@react-native-firebase/firestore";
import { subDays } from "date-fns";
import { getFunctions } from "@react-native-firebase/functions";

const safeParseNumber = (value: unknown) => {
    if (!value) return 0;
    else if (typeof value === "number") return value;
    else if (typeof value === "string") {
        const parsed = parseFloat(value);
        if (isNaN(parsed)) return 0;
        return parsed;
    } else {
        return 0;
    }
};

export const getAllFeedbacks = async () => {
  const start = performance.now();
  const feedbackRef = collection(getFirestore(), "feedbacks");
  const q = query(
    feedbackRef, 
    where("responded_at", "!=", null), 
    // NOTE: Not including older feedbacks makes the request quicker
    where("responded_at", ">=", Timestamp.fromDate(subDays(new Date(), 7)))
  );
  const snapshot = await getDocs(q);
  const end = performance.now();
  console.log(`Got all feedbacks in ${(end - start).toFixed(2)} ms`);
  return snapshot.docs.map((doc: any) => doc.data());
};

export const getEventAverageRating = async (eventId: string) => {
  const start = performance.now();
  const feedbackRef = collection(getFirestore(), "feedbacks");
  const q = query(
    feedbackRef,
    where("eventId", "==", Number(eventId)),
    where("responded_at", "!=", null)
  );
  if (!(await getDocs(q)).size) {
    const end = performance.now();
    console.log(`Got event [${eventId}] average rating in ${(end - start).toFixed(2)} ms`);
    return null;
  }
  const snapshot = await getAggregateFromServer(q, {
    avgTaste: average("feedback.criteria.taste"),
    avgTimeliness: average("feedback.criteria.timeliness"),
    avgServiceQuality: average("feedback.criteria.serviceQuality"),
    avgPresentation: average("feedback.criteria.presentation"),
  });
  const { avgTaste = 0, avgTimeliness = 0, avgServiceQuality = 0, avgPresentation = 0 } = snapshot.data();
  const total = safeParseNumber(avgTaste) + safeParseNumber(avgTimeliness) + safeParseNumber(avgServiceQuality) + safeParseNumber(avgPresentation);
  const totalAverage = total / 4;
  const end = performance.now();
  console.log(`Got event [${eventId}] average rating in ${(end - start).toFixed(2)} ms`);
  return totalAverage;
};

export const submitFeedback = getFunctions().httpsCallable("saveFeedback");

export const submitRealtimeFeedback = getFunctions().httpsCallable("saveRealtimeFeedback");