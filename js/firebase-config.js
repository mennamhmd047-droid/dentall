// Firebase Configuration and Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-analytics.js";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDaeGW-A8gbuLtvHxb1H0npWGJrePc0pbE",
  authDomain: "dental-6a394.firebaseapp.com",
  projectId: "dental-6a394",
  storageBucket: "dental-6a394.firebasestorage.app",
  messagingSenderId: "564546498650",
  appId: "1:564546498650:web:c97c98a1223abe384c6863",
  measurementId: "G-9CVRSCB3W6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Analytics (optional/supported check)
let analytics = null;
try {
  analytics = getAnalytics(app);
} catch (e) {
  console.warn("Firebase Analytics could not be initialized in this environment:", e);
}

export { analytics, logEvent };

// Firestore collection references
export const APPOINTMENTS_COLLECTION = "appointments";
export const MESSAGES_COLLECTION = "messages";

/**
 * Log custom analytics event safely
 */
export function trackEvent(eventName, eventParams = {}) {
  try {
    if (analytics) {
      logEvent(analytics, eventName, eventParams);
    }
  } catch (err) {
    console.debug("Analytics event skipped:", eventName, err);
  }
}

/**
 * Save new appointment to Firebase Firestore
 * With LocalStorage backup fallback
 */
export async function saveAppointment(appointmentData) {
  trackEvent("booking_attempt", { service: appointmentData.service });

  const record = {
    ...appointmentData,
    status: appointmentData.status || "pending", // pending, confirmed, cancelled, completed
    createdAt: serverTimestamp(),
    localCreatedAt: new Date().toISOString()
  };

  try {
    const docRef = await addDoc(collection(db, APPOINTMENTS_COLLECTION), record);
    trackEvent("booking_success", { service: appointmentData.service, id: docRef.id });
    
    // Also store locally for quick client reference
    saveAppointmentLocally({ id: docRef.id, ...record, source: "firebase" });

    return {
      success: true,
      id: docRef.id,
      source: "firebase",
      data: record
    };
  } catch (error) {
    console.warn("Could not save to Firestore directly (Check Firestore rules in console):", error);
    
    // Fallback: save to LocalStorage so data is never lost
    const localId = "local_" + Date.now();
    const localRecord = {
      id: localId,
      ...record,
      source: "local_cache",
      note: "تم الحفظ محلياً (يرجى تفعيل Firestore Rules في لوحة تحكم Firebase)"
    };
    saveAppointmentLocally(localRecord);

    return {
      success: true,
      id: localId,
      source: "local_cache",
      warning: error.message,
      data: localRecord
    };
  }
}

/**
 * Helper to save appointment to local cache
 */
function saveAppointmentLocally(item) {
  try {
    const list = JSON.parse(localStorage.getItem("noor_appointments") || "[]");
    list.unshift(item);
    localStorage.setItem("noor_appointments", JSON.stringify(list));
  } catch (e) {
    console.error("Local storage error:", e);
  }
}

/**
 * Listen for real-time appointments (used in Admin / Dashboard)
 */
export function subscribeToAppointments(onDataChange, onError) {
  try {
    const q = query(collection(db, APPOINTMENTS_COLLECTION), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      onDataChange(items);
    }, (err) => {
      console.warn("Firestore subscription error (falling back to local cache):", err);
      if (onError) onError(err);
      // Fallback to local
      const localItems = JSON.parse(localStorage.getItem("noor_appointments") || "[]");
      onDataChange(localItems);
    });
  } catch (err) {
    console.warn("Subscription failed, using local storage:", err);
    const localItems = JSON.parse(localStorage.getItem("noor_appointments") || "[]");
    onDataChange(localItems);
    return () => {};
  }
}

/**
 * Update appointment status (pending, confirmed, cancelled)
 */
export async function updateAppointmentStatus(id, newStatus) {
  try {
    if (id.startsWith("local_")) {
      const list = JSON.parse(localStorage.getItem("noor_appointments") || "[]");
      const updated = list.map(item => item.id === id ? { ...item, status: newStatus } : item);
      localStorage.setItem("noor_appointments", JSON.stringify(updated));
      return { success: true, source: "local" };
    }
    const docRef = doc(db, APPOINTMENTS_COLLECTION, id);
    await updateDoc(docRef, { status: newStatus, updatedAt: serverTimestamp() });
    return { success: true, source: "firebase" };
  } catch (error) {
    console.error("Failed to update status:", error);
    throw error;
  }
}

/**
 * Delete appointment
 */
export async function removeAppointment(id) {
  try {
    if (id.startsWith("local_")) {
      const list = JSON.parse(localStorage.getItem("noor_appointments") || "[]");
      const filtered = list.filter(item => item.id !== id);
      localStorage.setItem("noor_appointments", JSON.stringify(filtered));
      return { success: true };
    }
    await deleteDoc(doc(db, APPOINTMENTS_COLLECTION, id));
    return { success: true };
  } catch (error) {
    console.error("Failed to delete appointment:", error);
    throw error;
  }
}
