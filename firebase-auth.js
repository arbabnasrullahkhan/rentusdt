// firebase-auth.js - Secure Authentication & Role Management
import { auth, db, googleProvider } from './firebase-config.js';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { showToast } from './utils.js';

// User Sign-In with Google Auth
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Sync with Firestore User Record
    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);
    
    let userData = {
      uid: user.uid,
      fullName: user.displayName || 'DollarRent User',
      email: user.email,
      photoURL: user.photoURL || '',
      role: 'user',
      updatedAt: new Date().toISOString()
    };

    if (docSnap.exists()) {
      userData = { ...docSnap.data(), ...userData };
    } else {
      userData.createdAt = new Date().toISOString();
      await setDoc(userRef, userData, { merge: true });
    }

    localStorage.setItem('dollarrent_current_user', JSON.stringify(userData));
    showToast(`Welcome, ${userData.fullName}!`, 'success');
    return userData;
  } catch (error) {
    showToast(`Authentication failed: ${error.message}`, 'error');
    throw error;
  }
}

// Secure Admin Google Authentication (Role & Allowlist Checking)
export async function loginAdminWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Verify Admin Role in Firestore 'adminUsers' Collection
    const adminRef = doc(db, 'adminUsers', user.uid);
    const adminSnap = await getDoc(adminRef);

    if (adminSnap.exists() || user.email.endsWith('@dollarrent.com')) {
      const adminData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: 'admin',
        authorizedAt: new Date().toISOString()
      };
      localStorage.setItem('dollarrent_admin', JSON.stringify(adminData));
      showToast('Admin access granted!', 'success');
      return adminData;
    } else {
      await signOut(auth);
      localStorage.removeItem('dollarrent_admin');
      showToast('Access Denied: Your account is not authorized as Admin.', 'error');
      throw new Error('Unauthorized Admin Access');
    }
  } catch (error) {
    showToast(error.message, 'error');
    throw error;
  }
}

// Get Current Logged-in User
export function getCurrentUser() {
  try {
    const stored = localStorage.getItem('dollarrent_current_user');
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

// Get Admin Session
export function getAdminUser() {
  try {
    const stored = localStorage.getItem('dollarrent_admin');
    return stored ? JSON.parse(stored) : null;
  } catch { return null; }
}

// Sign Out
export async function logoutUser() {
  try { await signOut(auth); } catch {}
  localStorage.removeItem('dollarrent_current_user');
  localStorage.removeItem('dollarrent_admin');
  showToast('Logged out successfully', 'info');
}

// Auth Observer
export function initAuthObserver(callback) {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);
      const data = docSnap.exists() ? docSnap.data() : {
        uid: user.uid,
        fullName: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      };
      localStorage.setItem('dollarrent_current_user', JSON.stringify(data));
      callback(data);
    } else {
      callback(getCurrentUser());
    }
  });
}
