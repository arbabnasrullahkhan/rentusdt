// firestore.js
import { db } from './firebase-config.js';
import { collection, doc, getDocs, setDoc, onSnapshot, query, where, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Packages
export async function getPackages() {
  const packages = [];
  try {
    const q = query(collection(db, 'packages'), orderBy('amount', 'asc'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (doc.data().active !== false) {
        packages.push({ id: doc.id, ...doc.data() });
      }
    });
  } catch (error) {
    console.error("Error fetching packages:", error);
  }
  return packages;
}

// Payment Methods
export async function getPaymentMethods() {
  const methods = [];
  try {
    const q = query(collection(db, 'paymentMethods'));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (doc.data().active !== false) {
        methods.push({ id: doc.id, ...doc.data() });
      }
    });
  } catch (error) {
    console.error("Error fetching payment methods:", error);
  }
  return methods;
}

// Create Order
export async function createOrder(orderData) {
  try {
    const docRef = doc(db, 'orders', orderData.orderId);
    await setDoc(docRef, {
      ...orderData,
      status: 'submitted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return orderData.orderId;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

// Subscribe to Order Status
export function subscribeToOrder(orderId, callback) {
  const docRef = doc(db, 'orders', orderId);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback(null);
    }
  }, (error) => {
    console.error("Error listening to order:", error);
    callback(null);
  });
}
