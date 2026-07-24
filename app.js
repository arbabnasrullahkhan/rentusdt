// app.js - Premium FinTech Island Header, Dual FABs, Theme System & PWA Subsystem
import { getCurrentUser } from './firebase-auth.js';
import { escapeHTML } from './utils.js';

// ==========================================
// 1. INSTANT THEME INITIALIZATION (Prevents Flashing)
// ==========================================
const storedTheme = localStorage.getItem('theme') || 'dark'; // Dark is default
document.documentElement.setAttribute('data-theme', storedTheme);

document.addEventListener('DOMContentLoaded', () => {
  injectThemeStyles();
  initIslandHeader();
  initMobileBottomNav();
  initDualFABs();
  initOfflineDetector();
  registerServiceWorker();
});

// ==========================================
// 2. THEME SYSTEM & CSS INJECTION
// ==========================================
function injectThemeStyles() {
  const style = document.createElement('style');
  style.innerHTML = `
    /* Dark Theme (Default) */
    :root[data-theme="dark"] {
      --bg-color: #0B101E;
      --bg-cream: #0B101E;
      --card-solid: #151C2C;
      --border-color: #1E293B;
      --heading: #FFFFFF;
      --body: #94A3B8;
      --shadow-sm: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
      --shadow-md: 0 12px 24px -4px rgba(0, 0, 0, 0.5);
      --primary-glow: rgba(15, 98, 254, 0.25);
    }
    
    /* Premium Light Theme */
    :root[data-theme="light"] {
      --bg-color: #F8FAFC;
      --bg-cream: #FDFBF7;
      --card-solid: #FFFFFF;
      --border-color: #E2E8F0;
      --heading: #0B101E;
      --body: #475569;
      --shadow-sm: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      --shadow-md: 0 12px 24px -4px rgba(15, 98, 254, 0.08);
      --primary-glow: rgba(15, 98, 254, 0.12);
    }

    body { transition: background-color 0.4s ease, color 0.4s ease; }
    .card, .content-card, .feature-card, .review-card, .timeline-card, .info-box, .req-chip, .package-card, .faq-card {
      transition: background-color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease, transform 0.3s ease;
    }
  `;
  document.head.appendChild(style);
}

window.toggleTheme = function() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  
  // Update toggle icon
  const themeIcon = document.getElementById('theme-icon');
  if (next === 'dark') {
    themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`; // Moon
  } else {
    themeIcon.innerHTML = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`; // Sun
  }
};

// ==========================================
// 3. FLOATING ISLAND HEADER (with Icons)
// ==========================================
function initIslandHeader() {
  if (document.getElementById('island-header')) return;

  const user = getCurrentUser();
  const currentPage = window.location.pathname.split('/').pop() || 'home.html';
  if (currentPage === 'index.html') return; // Do not show on splash screen

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  
  const header = document.createElement('header');
  header.id = 'island-header';
  
  header.innerHTML = `
    <div class="island-nav">
      <!-- Brand -->
      <a href="home.html" class="island-logo">
        <div class="logo-box">
          <img src="assets/logo.png" alt="DollarRent Logo" class="brand-img-logo">
        </div>
        <span class="logo-text">Dollar<span>Rent</span></span>
      </a>

      <!-- 3 Nav Links with Icons -->
      <nav class="island-links">
        <a href="home.html" class="${currentPage === 'home.html' ? 'active' : ''}">
          <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          Home
        </a>
        <a href="profile.html" class="${currentPage === 'profile.html' ? 'active' : ''}">
          <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          Profile
        </a>
        <a href="faq.html" class="${currentPage === 'faq.html' ? 'active' : ''}">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          FAQ
        </a>
      </nav>

      <!-- Theme Toggle & Account -->
      <div class="island-actions">
        <button class="theme-btn" onclick="toggleTheme()" aria-label="Toggle Theme">
          <svg id="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            ${isDark ? '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>' : '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>'}
          </svg>
        </button>
        <a href="${user ? 'profile.html' : 'home.html#packages'}" class="primary-btn">
          ${user ? escapeHTML(user.fullName || 'Account') : 'Rent USD'}
        </a>
      </div>
    </div>
  `;

  document.body.prepend(header);

  const style = document.createElement('style');
  style.innerHTML = `
    #island-header {
      position: sticky; top: 20px; z-index: 1000;
      max-width: 900px; margin: 0 auto; padding: 0 16px;
    }
    .island-nav {
      background: var(--card-solid);
      backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
      border: 1px solid var(--border-color); border-radius: 100px;
      padding: 10px 14px 10px 24px; display: flex; align-items: center; justify-content: space-between;
      box-shadow: 0 16px 40px -8px rgba(0, 0, 0, 0.15);
      transition: background 0.4s ease, border-color 0.4s ease;
    }
    .island-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
    .logo-box { width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; }
    .brand-img-logo { width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 4px 8px rgba(15, 98, 254, 0.25)); }
    .logo-text { font-size: 20px; font-weight: 800; color: var(--heading); letter-spacing: -0.5px; }
    .logo-text span { color: #0F62FE; }
    
    .island-links { display: flex; gap: 28px; }
    .island-links a { 
      display: flex; align-items: center; gap: 6px;
      text-decoration: none; font-size: 14px; font-weight: 600; color: var(--body); transition: all 0.3s ease; position: relative;
    }
    .island-links a svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; transition: 0.3s; }
    .island-links a:hover { color: #0F62FE; }
    .island-links a.active { color: #0F62FE; font-weight: 700; }
    .island-links a.active svg { stroke-width: 2.5; }
    
    .island-actions { display: flex; align-items: center; gap: 10px; }
    .theme-btn {
      background: var(--bg-color); border: 1px solid var(--border-color);
      width: 40px; height: 40px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--heading);
      transition: all 0.3s ease;
    }
    .theme-btn:hover { border-color: #0F62FE; color: #0F62FE; transform: rotate(15deg); }
    
    .primary-btn {
      background: linear-gradient(135deg, #0F62FE, #004EE6); color: white;
      padding: 10px 22px; border-radius: 30px; font-size: 14px; font-weight: 700;
      text-decoration: none; box-shadow: 0 6px 16px rgba(15, 98, 254, 0.25);
      transition: all 0.25s ease;
    }
    .primary-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(15, 98, 254, 0.35); }

    @media (max-width: 767px) {
      #island-header { top: 12px; }
      .island-nav { padding: 12px 16px; border-radius: 28px; }
      .island-links { display: none; }
      .theme-btn { width: 36px; height: 36px; }
      .theme-btn svg { width: 18px; height: 18px; }
      .primary-btn { padding: 8px 16px; font-size: 13px; }
    }
  `;
  document.head.appendChild(style);
}

// ==========================================
// 4. DUAL FLOATING ACTION BUTTONS (WhatsApp + Telegram)
// ==========================================
function initDualFABs() {
  if (document.getElementById('dual-fabs-container')) return;

  const fabContainer = document.createElement('div');
  fabContainer.id = 'dual-fabs-container';
  
  fabContainer.innerHTML = `
    <a href="https://wa.me/923001234567" target="_blank" class="fab wa-fab" title="WhatsApp Support">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
    </a>
    <a href="https://t.me/RENTAL_DOLLOR" target="_blank" class="fab tg-fab" title="Telegram Support">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
    </a>
  `;
  document.body.appendChild(fabContainer);

  const style = document.createElement('style');
  style.innerHTML = `
    #dual-fabs-container {
      position: fixed; bottom: 100px; right: 24px; z-index: 9999;
      display: flex; flex-direction: column; gap: 14px;
    }
    .fab {
      width: 56px; height: 56px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: white; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .fab svg { width: 30px; height: 30px; }
    
    .wa-fab { background: linear-gradient(135deg, #25D366, #1DA851); animation: pulseWA 2.5s infinite; }
    .wa-fab:hover { transform: scale(1.1) translateY(-4px); animation: none; box-shadow: 0 14px 30px rgba(37, 211, 102, 0.5); }
    
    .tg-fab { background: linear-gradient(135deg, #0088cc, #005580); animation: pulseTG 2.5s infinite; animation-delay: 1.25s; }
    .tg-fab:hover { transform: scale(1.1) translateY(-4px); animation: none; box-shadow: 0 14px 30px rgba(0, 136, 204, 0.5); }
    
    @keyframes pulseWA { 0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.6); } 70% { box-shadow: 0 0 0 15px rgba(37, 211, 102, 0); } 100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); } }
    @keyframes pulseTG { 0% { box-shadow: 0 0 0 0 rgba(0, 136, 204, 0.6); } 70% { box-shadow: 0 0 0 15px rgba(0, 136, 204, 0); } 100% { box-shadow: 0 0 0 0 rgba(0, 136, 204, 0); } }

    @media (max-width: 767px) {
      #dual-fabs-container { bottom: 95px; right: 16px; gap: 10px; }
      .fab { width: 50px; height: 50px; }
      .fab svg { width: 26px; height: 26px; }
    }
  `;
  document.head.appendChild(style);
}

// ==========================================
// 5. NATIVE MOBILE DOCK (Bottom Nav)
// ==========================================
function initMobileBottomNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'home.html';
  if (currentPage === 'index.html') return;

  const nav = document.createElement('div');
  nav.className = 'mobile-bottom-nav';

  nav.innerHTML = `
    <a href="home.html" class="nav-item ${currentPage === 'home.html' ? 'active' : ''}">
      <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
      <span>Home</span>
    </a>
    <a href="order.html" class="nav-item ${currentPage === 'order.html' ? 'active' : ''}">
      <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
      <span>Order</span>
    </a>
    <a href="profile.html" class="nav-item ${currentPage === 'profile.html' ? 'active' : ''}">
      <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
      <span>Profile</span>
    </a>
    <a href="faq.html" class="nav-item ${currentPage === 'faq.html' ? 'active' : ''}">
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
      <span>FAQ</span>
    </a>
  `;
  document.body.appendChild(nav);

  const style = document.createElement('style');
  style.innerHTML = `
    .mobile-bottom-nav { display: none; }
    @media (max-width: 767px) {
      .mobile-bottom-nav {
        display: flex; justify-content: space-around; align-items: center;
        position: fixed; bottom: 0; left: 0; width: 100%;
        background: var(--card-solid); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
        border-top: 1px solid var(--border-color); z-index: 10000;
        padding: 10px 0 calc(10px + env(safe-area-inset-bottom));
        box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.15);
      }
      .mobile-bottom-nav .nav-item {
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        text-decoration: none; color: var(--body); font-size: 10px; font-weight: 700; gap: 5px; flex: 1; transition: all 0.2s ease;
      }
      .mobile-bottom-nav .nav-item svg { width: 24px; height: 24px; stroke: currentColor; fill: none; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; transition: all 0.3s ease; }
      .mobile-bottom-nav .nav-item.active { color: #0F62FE; }
      .mobile-bottom-nav .nav-item.active svg { fill: rgba(15, 98, 254, 0.15); stroke-width: 2.5; transform: scale(1.1); }
    }
  `;
  document.head.appendChild(style);
}

// ==========================================
// 6. OFFLINE DETECTOR
// ==========================================
function initOfflineDetector() {
  window.addEventListener('offline', () => {
    let bar = document.getElementById('offline-banner');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'offline-banner';
      bar.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 1l22 22"></path><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path><path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg><span>No internet connection. Please check your network.</span>`;
      document.body.prepend(bar);
      const style = document.createElement('style');
      style.id = 'offline-style';
      style.innerHTML = `
        #offline-banner {
          position: fixed; top: 16px; left: 50%; transform: translateX(-50%) translateY(-100px); z-index: 99999;
          background: rgba(239, 68, 68, 0.95); backdrop-filter: blur(16px); color: white; border-radius: 30px;
          padding: 10px 24px; font-size: 14px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 10px 25px rgba(239, 68, 68, 0.4); animation: slideDownToast 0.5s forwards;
        }
        @keyframes slideDownToast { to { transform: translateX(-50%) translateY(0); } }
      `;
      document.head.appendChild(style);
    }
  });

  window.addEventListener('online', () => {
    document.getElementById('offline-banner')?.remove();
    document.getElementById('offline-style')?.remove();
  });
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
  }
}
