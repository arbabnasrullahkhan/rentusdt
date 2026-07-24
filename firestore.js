// firestore.js - Firestore Database Abstraction & Real-time Listeners
import { db } from './firebase-config.js';
import { 
  collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, 
  onSnapshot, query, where, orderBy, limit, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { demoStorage } from './utils.js';

// Default Packages List
export const DEFAULT_PACKAGES = [
  { id: 'p50', amount: 50, fee: 9, processingTime: '~30 min', availability: 'Available', active: true, order: 1 },
  { id: 'p60', amount: 60, fee: 10, processingTime: '~30 min', availability: 'Available', active: true, order: 2 },
  { id: 'p70', amount: 70, fee: 11, processingTime: '~45 min', availability: 'Available', active: true, order: 3 },
  { id: 'p80', amount: 80, fee: 12, processingTime: '~45 min', availability: 'Available', active: true, order: 4 },
  { id: 'p90', amount: 90, fee: 13, processingTime: '~1 hr', availability: 'Available', active: true, order: 5 },
  { id: 'p100', amount: 100, fee: 14, processingTime: '~1 hr', availability: 'Available', active: true, order: 6 }
];

// Default Payment Methods
export const DEFAULT_PAYMENT_METHODS = [
  { id: 'easypaisa', label: 'Easypaisa Mobile Account', accountName: 'DollarRent Official', accountNumber: '0300-1234567', qrImageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=03001234567', instructions: 'Send exact rental fee to Easypaisa account and upload payment screenshot.', active: true },
  { id: 'jazzcash', label: 'JazzCash Wallet', accountName: 'DollarRent Merchant', accountNumber: '0309-7654321', qrImageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=03097654321', instructions: 'Transfer fee to JazzCash wallet, save reference ID, and submit screenshot.', active: true },
  { id: 'bank', label: 'Bank Transfer (Meezan Bank)', accountName: 'DollarRent Services', accountNumber: '0101-01048291039', qrImageUrl: '', instructions: 'Meezan Bank IBAN: PK36MEZN000101048291039. Upload transfer slip.', active: true },
  { id: 'binance', label: 'Binance Pay (Pay ID)', accountName: 'DollarRent Admin', accountNumber: '284910293', qrImageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=BinancePay284910293', instructions: 'Send USDT via Binance Pay to Pay ID 284910293. Fast verification.', active: true },
  { id: 'usdt', label: 'USDT (TRC20 Wallet)', accountName: 'TRC20 Deposit', accountNumber: 'TDRX928401928491029384019284', qrImageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=TDRX928401928491029384019284', instructions: 'Send TRC20 USDT only. Upload transaction hash screenshot.', active: true }
];

// Fetch Rental Packages
export async function getPackages() {
  try {
    const colRef = collection(db, 'packages');
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return list.sort((a, b) => (a.order || 0) - (b.order || 0));
    }
  } catch (e) {
    console.warn('Using default fallback packages:', e.message);
  }
  return DEFAULT_PACKAGES;
}

// Fetch Payment Methods
export async function getPaymentMethods() {
  try {
    const colRef = collection(db, 'paymentMethods');
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(m => m.active);
    }
  } catch (e) {
    console.warn('Using default fallback payment methods:', e.message);
  }
  return DEFAULT_PAYMENT_METHODS;
}

// Create New Order
export async function createOrder(orderData) {
  try {
    const colRef = collection(db, 'orders');
    const docRef = await addDoc(colRef, {
      ...orderData,
      status: 'submitted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    const result = { id: docRef.id, ...orderData, status: 'submitted' };
    demoStorage.saveOrder(result);
    return result;
  } catch (e) {
    console.warn('Saving order to local demo storage fallback:', e.message);
    const mockId = orderData.orderId || ('DR-' + Date.now().toString(36).toUpperCase());
    const result = { id: mockId, orderId: mockId, ...orderData, status: 'submitted', createdAt: new Date().toISOString() };
    demoStorage.saveOrder(result);
    return result;
  }
}

// Subscribe to Live Order Status
export function subscribeToOrder(orderId, callback) {
  try {
    const docRef = doc(db, 'orders', orderId);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback({ id: docSnap.id, ...docSnap.data() });
      } else {
        checkDemoFallback();
      }
    }, (err) => {
      checkDemoFallback();
    });
  } catch (e) {
    checkDemoFallback();
  }

  function checkDemoFallback() {
    const orders = demoStorage.getOrders();
    const found = orders.find(o => o.orderId === orderId || o.id === orderId);
    if (found) {
      callback(found);
    } else {
      callback(null);
    }
  }
}

// Admin: Get All Orders
export async function getAllOrders() {
  try {
    const colRef = collection(db, 'orders');
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  } catch (e) {
    console.warn('Fetching orders from demo local storage:', e.message);
  }
  return demoStorage.getOrders();
}

// Admin: Update Order Status
export async function updateOrderStatus(orderId, status, adminNote = '') {
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      status,
      adminNote,
      updatedAt: new Date().toISOString()
    });
  } catch (e) {
    console.warn('Updating demo order status locally:', e.message);
  }
  demoStorage.updateOrderStatus(orderId, status, adminNote);
}
