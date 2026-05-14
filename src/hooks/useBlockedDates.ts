import { useState, useEffect } from 'react';
import { collection, doc, setDoc, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export interface BlockedDate {
  date: string; // YYYY-MM-DD format
  blockedAt: Date;
  blockedBy: string; // admin email
}

// Hook to read blocked dates from Firestore
export function useBlockedDates() {
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'blockedDates'),
      (snapshot) => {
        const dates = snapshot.docs.map((doc) => doc.id); // doc.id = YYYY-MM-DD
        setBlockedDates(dates);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading blocked dates:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { blockedDates, loading };
}

// Function to block/unblock dates
export async function setDateBlocked(dateStr: string, blocked: boolean, adminEmail: string) {
  const docRef = doc(db, 'blockedDates', dateStr);
  
  if (blocked) {
    await setDoc(docRef, {
      date: dateStr,
      blockedAt: Timestamp.now(),
      blockedBy: adminEmail,
    });
  } else {
    // To unblock, we delete the document
    const { deleteDoc } = await import('firebase/firestore');
    await deleteDoc(docRef);
  }
}
