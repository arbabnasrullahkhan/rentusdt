// firestore.js - Complete Firestore Database Abstraction & Real-time Listeners
import { db } from './firebase-config.js';
import { 
  collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, 
  onSnapshot, query, where, orderBy, limit, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { demoStorage } from './utils.js';

// ==========================================
// 1. DEFAULT PACKAGES (Can be overridden by Admin Panel)
// ==========================================
export const DEFAULT_PACKAGES = [
  { id: 'p50', amount: 50, fee: 9, duration: '4 Hours', lossExtra: '$19 (38% of $50)', profitRule: 'Return $50, profit is yours', availability: 'Available', active: true, order: 1 },
  { id: 'p100', amount: 100, fee: 20, duration: '4 Hours', lossExtra: '$38 (38% of $100)', profitRule: 'Return $100, profit is yours', availability: 'Available', active: true, order: 2 },
  { id: 'p150', amount: 150, fee: 35, duration: '4 Hours', lossExtra: '$57 (38% of $150)', profitRule: 'Return $150, profit is yours', availability: 'Available', active: true, order: 3 },
  { id: 'p250', amount: 250, fee: 55, duration: '6 Hours', lossExtra: '$95 (38% of $250)', profitRule: 'Return $250, profit is yours', availability: 'Available', active: true, order: 4 },
  { id: 'p500', amount: 500, fee: 100, duration: '12 Hours', lossExtra: '$190 (38% of $500)', profitRule: 'Return $500, profit is yours', availability: 'Available', active: true, order: 5 },
  { id: 'p1000', amount: 1000, fee: 180, duration: '24 Hours', lossExtra: '$380 (38% of $1,000)', profitRule: 'Return $1,000, profit is yours', availability: 'Available', active: true, order: 6 },
  { id: 'p2500', amount: 2500, fee: 400, duration: '2 Days', lossExtra: '$950 (38% of $2,500)', profitRule: 'Return $2,500, profit is yours', availability: 'Available', active: true, order: 7 },
  { id: 'p5000', amount: 5000, fee: 700, duration: '3 Days', lossExtra: '$1,900 (38% of $5,000)', profitRule: 'Return $5,000, profit is yours', availability: 'Available', active: true, order: 8 },
  { id: 'p10000', amount: 10000, fee: 1200, duration: '5 Days', lossExtra: '$3,800 (38% of $10,000)', profitRule: 'Return $10,000, profit is yours', availability: 'Available', active: true, order: 9 },
  { id: 'p25000', amount: 25000, fee: 2500, duration: '7 Days', lossExtra: '$9,500 (38% of $25,000)', profitRule: 'Return $25,000, profit is yours', availability: 'Available', active: true, order: 10 },
  { id: 'p50000', amount: 50000, fee: 4500, duration: '10 Days', lossExtra: '$19,000 (38% of $50,000)', profitRule: 'Return $50,000, profit is yours', availability: 'Available', active: true, order: 11 }
];

// KYC Strict Requirements Standard List
export const KYC_REQUIREMENTS = [
  "Google Sign-In", "Full Name", "Phone Number", "Country", 
  "Binance UID", "Binance Email", "Wallet Address", "Wallet Network Selection", 
  "CNIC Front", "CNIC Back", "Live Selfie", "Payment Screenshot", 
  "Transaction ID", "Terms Acceptance"
];

// ==========================================
// 2. DEFAULT PAYMENT METHODS
// ==========================================
export const DEFAULT_PAYMENT_METHODS = [
  { id: 'easypaisa', label: 'Easypaisa Account', accountName: 'DollarRent Official', accountNumber: '0300-1234567', instructions: 'Send exact rental fee to Easypaisa account and upload payment screenshot.', active: true },
  { id: 'jazzcash', label: 'JazzCash Wallet', accountName: 'DollarRent Merchant', accountNumber: '0309-7654321', instructions: 'Transfer fee to JazzCash wallet, save reference ID, and submit screenshot.', active: true },
  { id: 'bank', label: 'Bank Transfer', accountName: 'DollarRent Services', accountNumber: 'PK36MEZN000101048291039', instructions: 'Send funds to given IBAN. Upload transfer slip.', active: true },
  { id: 'binance', label: 'Binance Pay', accountName: 'DollarRent Admin', accountNumber: '284910293', instructions: 'Send USDT via Binance Pay to Pay ID. Fast verification.', active: true },
  { id: 'usdt', label: 'USDT (TRC20)', accountName: 'TRC20 Deposit', accountNumber: 'TDRX928401928491029384019284', instructions: 'Send TRC20 USDT only. Upload transaction hash screenshot.', active: true }
];

// ==========================================
// 3. FETCH PACKAGES FROM ADMIN PANEL
// ==========================================
export async function getPackages() {
  try {
    const colRef = collection(db, 'packages');
    const snapshot = await getDocs(colRef);
    
    // If Admin has added packages to Firebase, show those
    if (!snapshot.empty) {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Filter out inactive packages and sort by order
      return list.filter(pkg => pkg.active).sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    
    // Fallback: If Firebase is empty, show the default 11 packages
    return DEFAULT_PACKAGES;
  } catch (e) {
    console.warn('Firebase error fetching packages, using defaults:', e.message);
    return DEFAULT_PACKAGES;
  }
}

// ==========================================
// 4. FETCH PAYMENT METHODS (ADMIN CONTROLLED)
// ==========================================
export async function getPaymentMethods() {
  try {
    const colRef = collection(db, 'paymentMethods');
    const snapshot = await getDocs(colRef);
    
    if (!snapshot.empty) {
      // ONLY return payment methods where 'active' is exactly true
      return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(method => method.active === true);
    }
    
    // Fallback: If Firebase is empty, return active defaults
    return DEFAULT_PAYMENT_METHODS.filter(m => m.active === true);
  } catch (e) {
    console.warn('Firebase error fetching payment methods, using defaults:', e.message);
    return DEFAULT_PAYMENT_METHODS.filter(m => m.active === true);
  }
}

// ==========================================
// 5. CREATE ORDER (User submits order)
// ==========================================
export async function createOrder(orderData) {
  try {
    const colRef = collection(db, 'orders');
    
    // Ensure 14 Requirements logic is stamped on the order
    const enhancedOrderData = {
      ...orderData,
      requirementsMet: true, // Frontend validation handles this
      status: 'submitted',
      createdAt: serverTimestamp(), // Firebase Server time
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(colRef, enhancedOrderData);
    
    const result = { id: docRef.id, ...enhancedOrderData, status: 'submitted' };
    demoStorage.saveOrder(result); // Save to local storage as a backup
    return result;
  } catch (e) {
    console.error('Firebase save failed, falling back to local storage:', e.message);
    
    const mockId = orderData.orderId || ('DR-' + Date.now().toString(36).toUpperCase());
    const fallbackResult = { id: mockId, orderId: mockId, ...orderData, status: 'submitted', createdAt: new Date().toISOString() };
    
    demoStorage.saveOrder(fallbackResult);
    return fallbackResult;
  }
}

// ==========================================
// 6. REAL-TIME LIVE ORDER TRACKING
// ==========================================
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
      console.warn("Live listener error, using fallback.", err.message);
      checkDemoFallback();
    });
  } catch (e) {
    checkDemoFallback();
  }

  function checkDemoFallback() {
    const orders = demoStorage.getOrders();
    const found = orders.find(o => o.orderId === orderId || o.id === orderId);
    callback(found || null);
  }
}

// ==========================================
// 7. ADMIN: GET ALL ORDERS
// ==========================================
export async function getAllOrders() {
  try {
    const colRef = collection(db, 'orders');
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  } catch (e) {
    console.warn('Fetching orders from demo local storage due to error:', e.message);
  }
  return demoStorage.getOrders().reverse();
}

// ==========================================
// 8. ADMIN: UPDATE ORDER STATUS
// ==========================================
export async function updateOrderStatus(orderId, status, adminNote = '') {
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      status,
      adminNote,
      updatedAt: serverTimestamp()
    });
  } catch (e) {
    console.warn('Updating demo order status locally due to error:', e.message);
  }
  
  // Always update local storage for offline capabilities
  demoStorage.updateOrderStatus(orderId, status, adminNote);
}
