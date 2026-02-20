/* ================================================================
   ARNAV FLIGHTS — Auth State Management & Nav UI
   ================================================================ */

'use strict';

/* ── Update navbar when auth state changes ──────────────────────── */
function updateNavUI(user) {
  const navGuest   = document.getElementById('navGuest');
  const navUser    = document.getElementById('navUser');
  const navAvatar  = document.getElementById('navAvatar');
  const adminBtn   = document.getElementById('navAdminBtn');
  const mobileGuest = document.getElementById('mobileGuestLinks');
  const mobileUser  = document.getElementById('mobileUserLinks');
  const mobileAdmin = document.getElementById('mobileAdminBtn');
  const mobileUserName = document.getElementById('mobileUserName');
  const demoBar    = document.getElementById('demoModeBar');

  if (user) {
    /* ── Logged in ── */
    if (navGuest)  { navGuest.style.display  = 'none'; }
    if (navUser)   { navUser.style.display   = 'flex'; }

    /* Set avatar initials */
    if (navAvatar) {
      const name = user.displayName || user.email || 'U';
      const initials = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
      navAvatar.textContent = initials;
      navAvatar.setAttribute('data-tooltip', name);
    }

    /* Show admin button only for admins */
    if (adminBtn)   { adminBtn.style.display   = user.isAdmin ? 'inline-flex' : 'none'; }
    if (mobileAdmin){ mobileAdmin.style.display = user.isAdmin ? 'flex' : 'none'; }

    /* Mobile: show user section */
    if (mobileGuest) { mobileGuest.style.display = 'none'; }
    if (mobileUser)  { mobileUser.style.display  = 'flex'; }
    if (mobileUserName) { mobileUserName.textContent = user.displayName || user.email; }

  } else {
    /* ── Logged out ── */
    if (navGuest)  { navGuest.style.display  = 'flex'; }
    if (navUser)   { navUser.style.display   = 'none'; }
    if (mobileGuest) { mobileGuest.style.display = 'flex'; }
    if (mobileUser)  { mobileUser.style.display  = 'none'; }
  }

  /* Demo mode indicator */
  if (demoBar && window.af?.isDemo) demoBar.style.display = 'flex';
}

/* ── Sign Out handler ───────────────────────────────────────────── */
async function handleSignOut() {
  try {
    await window.af.auth.signOut();
    if (typeof showToast === 'function') showToast('Signed out successfully', '👋');
    setTimeout(() => window.location.href = 'index.html', 400);
  } catch(e) {
    console.error('Sign out error:', e);
  }
}

/* ── Auth init on DOM ready ─────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (!window.af) { console.warn('af not initialized'); return; }

  /* Listen for auth state changes */
  window.af.auth.onAuthStateChanged(user => {
    window.af.currentUser = user;
    updateNavUI(user);
  });

  /* Wire sign out buttons */
  document.getElementById('navSignOutBtn')
    ?.addEventListener('click', handleSignOut);
  document.getElementById('mobileSignOut')
    ?.addEventListener('click', handleSignOut);
});

/* ── Page Protection Helpers ────────────────────────────────────── */
window.requireAuth = function(redirectTo = 'login.html') {
  if (!window.af) return;
  window.af.auth.onAuthStateChanged(user => {
    if (!user) {
      const page = location.pathname.split('/').pop() || 'index.html';
      window.location.href = redirectTo + '?redirect=' + encodeURIComponent(page);
    }
  });
};

window.requireAdmin = function() {
  if (!window.af) return;
  window.af.auth.onAuthStateChanged(user => {
    if (!user) {
      window.location.href = 'login.html?redirect=admin.html';
    } else if (!user.isAdmin) {
      if (typeof showToast === 'function') showToast('Access denied. Admin only area.', '🚫');
      setTimeout(() => window.location.href = 'index.html', 800);
    }
  });
};

/* ── Expose global signout ──────────────────────────────────────── */
window.__afSignOut = handleSignOut;
