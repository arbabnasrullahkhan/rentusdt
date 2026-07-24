// app.js - Premium FinTech Island Header, Floating Dock, Dual FABs & PWA Subsystem
import { getCurrentUser } from './firebase-auth.js';
import { escapeHTML } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  initIslandHeader();
  initIslandDock();
  initDualFABs();
  initOfflineDetector();
  registerServiceWorker();
});

// ==========================================
// 1. FLOATING ISLAND HEADER (Apple FinTech Style)
// ==========================================
function initIslandHeader() {
  if (document.getElementById('island-header')) return;

  const user = getCurrentUser();
  const currentPage = window.location.pathname.split('/').pop() || 'home.html';
  if (currentPage === 'index.html') return; // Do not show on splash screen

  // Generate User Avatar or Fallback Initial
  let userAvatarHtml = '';
  let userNameText = 'Rent USD';

  if (user) {
    const firstName = user.fullName ? user.fullName.split(' ')[0] : 'User';
    userNameText = escapeHTML(firstName);
    if (user.photoURL) {
      userAvatarHtml = `<img src="${user.photoURL}" class="header-avatar" alt="Profile" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div class="header-avatar-fallback" style="display:none;">${firstName.charAt(0).toUpperCase()}</div>`;
    } else {
      userAvatarHtml = `<div class="header-avatar-fallback">${firstName.charAt(0).toUpperCase()}</div>`;
    }
  }

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

      <!-- User Account Action -->
      <div class="island-actions">
        <a href="${user ? 'profile.html' : 'home.html#packages'}" class="primary-btn">
          ${userAvatarHtml}
          <span>${userNameText}</span>
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
      animation: slideDownHeader 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes slideDownHeader { from { transform: translateY(-40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    .island-nav {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(226, 232, 240, 0.8); border-radius: 100px;
      padding: 10px 14px 10px 24px; display: flex; align-items: center; justify-content: space-between;
      box-shadow: 0 16px 40px -8px rgba(0, 0, 0, 0.12);
    }
    .island-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
    .logo-box { width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; }
    .brand-img-logo { width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 4px 8px rgba(15, 98, 254, 0.25)); }
    .logo-text { font-size: 20px; font-weight: 800; color: #0B101E; letter-spacing: -0.5px; }
    .logo-text span { color: #0F62FE; }
    
    .island-links { display: flex; gap: 28px; }
    .island-links a { 
      display: flex; align-items: center; gap: 6px;
      text-decoration: none; font-size: 14px; font-weight: 600; color: #64748B; transition: all 0.3s ease; position: relative;
    }
    .island-links a svg { width: 16px; height: 16px; stroke: currentColor; fill: none; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; transition: 0.3s; }
    .island-links a:hover { color: #0F62FE; }
    .island-links a.active { color: #0F62FE; font-weight: 700; }
    .island-links a.active svg { stroke-width: 2.5; }
    
    .island-actions { display: flex; align-items: center; gap: 10px; }
    
    .primary-btn {
      background: linear-gradient(135deg, #0F62FE, #004EE6); color: white;
      padding: 8px 20px; border-radius: 30px; font-size: 14px; font-weight: 700;
      text-decoration: none; box-shadow: 0 6px 16px rgba(15, 98, 254, 0.25);
      display: flex; align-items: center; gap: 8px; transition: all 0.25s ease;
    }
    .primary-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(15, 98, 254, 0.35); }
    
    /* User Avatar in Header */
    .header-avatar { width: 24px; height: 24px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255,255,255,0.5); }
    .header-avatar-fallback {
      width: 24px; height: 24px; border-radius: 50%; background: #FFFFFF; color: #0F62FE;
      display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 900;
    }

    @media (max-width: 767px) {
      #island-header { top: 12px; }
      .island-nav { padding: 12px 16px; border-radius: 28px; }
      .island-links { display: none; }
      .primary-btn { padding: 8px 16px; font-size: 13px; }
    }
  `;
  document.head.appendChild(style);
}

// ==========================================
// 2. NATIVE FLOATING ISLAND DOCK (Mobile Bottom Nav)
// ==========================================
function initIslandDock() {
  const currentPage = window.location.pathname.split('/').pop() || 'home.html';
  if (currentPage === 'index.html') return;

  const user = getCurrentUser();

  // Create Profile Icon or User Avatar
  let profileIconHtml = `<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
  if (user) {
    if (user.photoURL) {
      profileIconHtml = `<img src="${user.photoURL}" class="dock-avatar" alt="Me" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                         <div class="dock-avatar-fallback" style="display:none;">${user.fullName.charAt(0).toUpperCase()}</div>`;
    } else {
      profileIconHtml = `<div class="dock-avatar-fallback">${user.fullName.charAt(0).toUpperCase()}</div>`;
    }
  }

  const nav = document.createElement('div');
  nav.className = 'island-dock-wrapper';

  nav.innerHTML = `
    <div class="island-dock">
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
        ${profileIconHtml}
        <span>Profile</span>
      </a>
    </div>
  `;
  document.body.appendChild(nav);

  const style = document.createElement('style');
  style.innerHTML = `
    .island-dock-wrapper { display: none; }
    
    @media (max-width: 767px) {
      .island-dock-wrapper {
        display: flex; justify-content: center;
        position: fixed; bottom: 20px; left: 0; right: 0;
        z-index: 10000; padding: 0 20px;
        animation: slideUpDock 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      }
      @keyframes slideUpDock { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

      .island-dock {
        width: 100%; max-width: 400px;
        background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
        border: 1px solid rgba(229, 231, 235, 0.8); border-radius: 40px;
        display: flex; justify-content: space-around; align-items: center;
        padding: 12px 10px;
        box-shadow: 0 16px 40px -8px rgba(0, 0, 0, 0.15);
      }
      .nav-item {
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        text-decoration: none; color: #94A3B8; font-size: 10px; font-weight: 700; gap: 5px; flex: 1; transition: all 0.2s ease;
      }
      .nav-item svg { width: 24px; height: 24px; stroke: currentColor; fill: none; stroke-width: 2.2; stroke-linecap: round; stroke-linejoin: round; transition: 0.3s; }
      
      .nav-item.active { color: #0F62FE; }
      .nav-item.active svg { fill: rgba(15, 98, 254, 0.15); stroke-width: 2.5; transform: scale(1.1); }
      
      /* Dock Avatar Styling */
      .dock-avatar { width: 26px; height: 26px; border-radius: 50%; object-fit: cover; border: 2px solid transparent; transition: 0.3s; }
      .dock-avatar-fallback { width: 26px; height: 26px; border-radius: 50%; background: #E2E8F0; color: #475569; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 900; transition: 0.3s; }
      
      .nav-item.active .dock-avatar { border-color: #0F62FE; transform: scale(1.1); }
      .nav-item.active .dock-avatar-fallback { background: #0F62FE; color: white; transform: scale(1.1); }
    }
  `;
  document.head.appendChild(style);
}

// ==========================================
// 3. DUAL FLOATING ACTION BUTTONS (WhatsApp + Telegram)
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
      animation: slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes slideInRight { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    
    .fab {
      width: 56px; height: 56px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: white; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
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
      #dual-fabs-container { bottom: 105px; right: 16px; gap: 10px; } /* Sits right above the new floating dock */
      .fab { width: 50px; height: 50px; }
      .fab svg { width: 26px; height: 26px; }
    }
  `;
  document.head.appendChild(style);
}

// ==========================================
// 4. OFFLINE DETECTOR
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
