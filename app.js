// app.js - Premium FinTech Floating Capsule Header, Mobile Bottom Nav, and PWA Subsystem
import { getCurrentUser } from './firebase-auth.js';
import { escapeHTML } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  initFloatingCapsuleHeader();
  initMobileBottomNav();
  initFloatingSupport();
  initOfflineDetector();
  registerServiceWorker();
});

// ==========================================
// 1. FLOATING CAPSULE HEADER (Apple Style)
// ==========================================
function initFloatingCapsuleHeader() {
  if (document.getElementById('floating-capsule-header')) return;

  const user = getCurrentUser();
  const currentPage = window.location.pathname.split('/').pop() || 'home.html';
  
  if (currentPage === 'index.html') return; // Do not show on splash screen

  const header = document.createElement('header');
  header.id = 'floating-capsule-header';
  
  // UPDATED LINKS AS REQUESTED: Home, Profile, Order (order.html), FAQ
  header.innerHTML = `
    <div class="capsule-nav">
      <!-- STRICT LOGO COMPLIANCE -->
      <a href="home.html" class="capsule-logo">
        <div class="logo-box">
          <img src="assets/logo.png" alt="DollarRent Logo" class="brand-img-logo">
        </div>
        <span class="logo-text">Dollar<span>Rent</span></span>
      </a>

      <nav class="capsule-links">
        <a href="home.html" class="${currentPage === 'home.html' ? 'active' : ''}">Home</a>
        <a href="profile.html" class="${currentPage === 'profile.html' ? 'active' : ''}">Profile</a>
        <a href="order.html" class="${currentPage === 'order.html' ? 'active' : ''}">Order</a>
        <a href="faq.html" class="${currentPage === 'faq.html' ? 'active' : ''}">FAQ</a>
      </nav>

      <div class="capsule-actions">
        <a href="https://t.me/RENTAL_DOLLOR" target="_blank" class="capsule-btn tg-btn" title="Telegram Support">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
          Support
        </a>
        <a href="${user ? 'profile.html' : 'home.html#packages'}" class="capsule-btn primary-btn">
          ${user ? escapeHTML(user.fullName || 'Account') : 'Rent USD'}
        </a>
      </div>
    </div>
  `;

  document.body.prepend(header);

  // High-End FinTech Styling injected for Header
  const style = document.createElement('style');
  style.innerHTML = `
    #floating-capsule-header {
      position: sticky;
      top: 20px;
      z-index: 1000;
      max-width: 1050px;
      margin: 0 auto;
      padding: 0 16px;
      transition: transform 0.3s ease;
    }
    .capsule-nav {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(229, 231, 235, 0.6);
      border-radius: 100px;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 12px 35px -5px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 1);
    }
    .capsule-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; }
    .logo-box {
      width: 40px; height: 40px;
      display: flex; align-items: center; justify-content: center;
    }
    .brand-img-logo { width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 4px 8px rgba(15, 98, 254, 0.25)); }
    .logo-text { font-size: 20px; font-weight: 800; color: #0B101E; letter-spacing: -0.5px; }
    .logo-text span { color: #0F62FE; }
    
    .capsule-links { display: flex; gap: 28px; font-size: 15px; font-weight: 600; color: #64748B; }
    .capsule-links a { text-decoration: none; color: inherit; transition: all 0.3s ease; position: relative; }
    .capsule-links a:hover { color: #0F62FE; }
    .capsule-links a.active { color: #0F62FE; font-weight: 700; }
    .capsule-links a.active::after {
      content: ''; position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%);
      width: 6px; height: 6px; border-radius: 50%; background: #0F62FE;
    }
    
    .capsule-actions { display: flex; align-items: center; gap: 12px; }
    .capsule-btn {
      padding: 10px 22px; border-radius: 30px; font-size: 14px; font-weight: 700;
      text-decoration: none; display: inline-flex; align-items: center; gap: 6px;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .tg-btn { background: rgba(0, 136, 204, 0.08); color: #0088cc; }
    .tg-btn:hover { background: rgba(0, 136, 204, 0.15); transform: translateY(-2px); }
    .primary-btn { background: linear-gradient(135deg, #0F62FE, #004EE6); color: white; box-shadow: 0 6px 16px rgba(15, 98, 254, 0.25); }
    .primary-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(15, 98, 254, 0.35); }

    @media (max-width: 767px) {
      #floating-capsule-header { top: 12px; padding: 0 12px; }
      .capsule-nav { padding: 12px 18px; border-radius: 24px; }
      .capsule-links { display: none; }
      .tg-btn { display: none; }
      .logo-text { font-size: 18px; }
      .primary-btn { padding: 8px 16px; font-size: 13px; }
    }
  `;
  document.head.appendChild(style);
}

// ==========================================
// 2. NATIVE MOBILE DOCK (iOS / FinTech Style)
// ==========================================
function initMobileBottomNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'home.html';
  if (currentPage === 'index.html') return;

  const nav = document.createElement('div');
  nav.className = 'mobile-bottom-nav';
  
  // UPDATED LINKS AS REQUESTED: Home, Order, Support, Profile
  nav.innerHTML = `
    <a href="home.html" class="nav-item ${currentPage === 'home.html' ? 'active' : ''}">
      <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
      <span>Home</span>
    </a>
    <a href="order.html" class="nav-item ${currentPage === 'order.html' ? 'active' : ''}">
      <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
      <span>Order</span>
    </a>
    <a href="https://t.me/RENTAL_DOLLOR" target="_blank" class="nav-item">
      <svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
      <span>Support</span>
    </a>
    <a href="profile.html" class="nav-item ${currentPage === 'profile.html' ? 'active' : ''}">
      <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
      <span>Profile</span>
    </a>
  `;
  document.body.appendChild(nav);

  const style = document.createElement('style');
  style.innerHTML = `
    .mobile-bottom-nav { display: none; }

    @media (max-width: 767px) {
      .mobile-bottom-nav {
        display: flex;
        justify-content: space-around;
        align-items: center;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border-top: 1px solid rgba(229, 231, 235, 0.8);
        padding: 10px 0 calc(10px + env(safe-area-inset-bottom));
        z-index: 10000;
        box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.06);
      }
      .mobile-bottom-nav .nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        color: #94A3B8;
        font-size: 10px;
        font-weight: 700;
        gap: 5px;
        flex: 1;
        transition: all 0.2s ease;
      }
      .mobile-bottom-nav .nav-item svg {
        width: 24px; height: 24px;
        stroke: currentColor; fill: none;
        stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .mobile-bottom-nav .nav-item.active { color: #0F62FE; }
      .mobile-bottom-nav .nav-item.active svg { fill: rgba(15, 98, 254, 0.15); stroke-width: 2.5; transform: scale(1.1); }
    }
  `;
  document.head.appendChild(style);
}

// ==========================================
// 3. FLOATING TELEGRAM SUPPORT (Pulsing Glow)
// ==========================================
function initFloatingSupport() {
  if (document.getElementById('floating-support-btn')) return;

  const btn = document.createElement('div');
  btn.id = 'floating-support-btn';
  
  btn.innerHTML = `
    <a href="https://t.me/RENTAL_DOLLOR" target="_blank" class="floating-btn" title="Telegram Support">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
    </a>
  `;
  document.body.appendChild(btn);

  const style = document.createElement('style');
  style.innerHTML = `
    #floating-support-btn {
      position: fixed;
      bottom: 100px;
      right: 24px;
      z-index: 9999;
    }
    .floating-btn {
      width: 56px; height: 56px;
      background: linear-gradient(135deg, #0088cc, #005580);
      color: white;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 10px 25px rgba(0, 136, 204, 0.4);
      animation: pulseGlow 2.5s infinite;
      transition: transform 0.3s ease;
    }
    .floating-btn:hover { transform: scale(1.1); animation: none; box-shadow: 0 12px 30px rgba(0, 136, 204, 0.6); }
    @keyframes pulseGlow {
      0% { box-shadow: 0 0 0 0 rgba(0, 136, 204, 0.6); }
      70% { box-shadow: 0 0 0 15px rgba(0, 136, 204, 0); }
      100% { box-shadow: 0 0 0 0 rgba(0, 136, 204, 0); }
    }
    @media (max-width: 767px) {
      #floating-support-btn { bottom: 95px; right: 16px; }
      .floating-btn { width: 50px; height: 50px; }
      .floating-btn svg { width: 24px; height: 24px; }
    }
  `;
  document.head.appendChild(style);
}

// ==========================================
// 4. OFFLINE DETECTOR (FinTech Slide-down Banner)
// ==========================================
function initOfflineDetector() {
  window.addEventListener('offline', () => {
    let bar = document.getElementById('offline-banner');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'offline-banner';
      bar.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 1l22 22"></path><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path><path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
        <span>No internet connection. Please check your network.</span>
      `;
      document.body.prepend(bar);
      
      const style = document.createElement('style');
      style.id = 'offline-style';
      style.innerHTML = `
        #offline-banner {
          position: fixed; top: 16px; left: 50%; transform: translateX(-50%) translateY(-100px); z-index: 99999;
          background: rgba(239, 68, 68, 0.95); backdrop-filter: blur(16px);
          color: white; text-align: center; border-radius: 30px;
          padding: 10px 24px; font-size: 14px; font-weight: 600;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 10px 25px rgba(239, 68, 68, 0.4);
          animation: slideDownToast 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideDownToast { to { transform: translateX(-50%) translateY(0); } }
      `;
      document.head.appendChild(style);
    }
  });

  window.addEventListener('online', () => {
    const bar = document.getElementById('offline-banner');
    const style = document.getElementById('offline-style');
    if (bar) bar.remove();
    if (style) style.remove();
  });
}

// ==========================================
// 5. PWA SERVICE WORKER
// ==========================================
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Silent catch for initial PWA setup
      });
    });
  }
}
