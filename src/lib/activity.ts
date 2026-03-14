import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import type { Activity } from "@/lib/types";

export type ActivityType = Activity["type"];

interface ActivityInput {
  readonly projectId: string;
  readonly userId: string;
  readonly type: ActivityType;
  readonly message: string;
}

export async function logActivity(
  projectId: string,
  userId: string,
  type: ActivityType,
  message: string
): Promise<string> {
  const db = getFirebaseDb();
  const activitiesRef = collection(db, "activities");

  const docRef = await addDoc(activitiesRef, {
    projectId,
    userId,
    type,
    message,
    createdAt: serverTimestamp(),
  } satisfies Omit<ActivityInput, never> & { readonly createdAt: ReturnType<typeof serverTimestamp> });

  return docRef.id;
}

export function subscribeToActivities(
  projectId: string,
  callback: (activities: readonly Activity[]) => void
): Unsubscribe {
  const db = getFirebaseDb();
  const activitiesRef = collection(db, "activities");

  const q = query(
    activitiesRef,
    where("projectId", "==", projectId),
    orderBy("createdAt", "desc"),
    limit(20)
  );

  return onSnapshot(q, (snapshot) => {
    const activities: readonly Activity[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        projectId: data.projectId as string,
        userId: data.userId as string,
        type: data.type as Activity["type"],
        message: data.message as string,
        createdAt: data.createdAt?.toDate?.() ?? new Date(),
      } satisfies Activity;
    });

    callback(activities);
  });
}
