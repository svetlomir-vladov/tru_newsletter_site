import { $, toast } from './utils.js';
import { loadAll } from './api.js';
import { handleLogin, quickLogin, getStoredUser } from './auth.js';

/* ══════════════════════════════════════════
   State
══════════════════════════════════════════ */
let currentUser = null;

/* ══════════════════════════════════════════
   App boot
══════════════════════════════════════════ */
async function boot() {
  bindStaticEvents();

  // Restore session (tab reload)
  const saved = getStoredUser();
  if (saved) {
    await loadAll();
    currentUser = saved;
    showApp();
  }
}

/* ══════════════════════════════════════════
   Show / hide app
══════════════════════════════════════════ */
function showApp() {
  $('login-page').style.display = 'none';
  $('app').style.display        = 'flex';
}

function hideApp() {
  $('app').style.display        = 'none';
  $('login-page').style.display = 'flex';
  $('sid-input').value          = '';
}

/* ══════════════════════════════════════════
   Event bindings (called once at boot)
══════════════════════════════════════════ */
function bindStaticEvents() {
  /* ── Login ── */
  $('btn-login').addEventListener('click', handleLogin);
  $('sid-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') handleLogin();
    $('sid-input').classList.remove('error');
    $('login-err').classList.remove('show');
  });
  document.querySelectorAll('.demo-btn').forEach(btn => {
    btn.addEventListener('click', () => quickLogin(btn.dataset.studentId));
  });

  /* ── Auth events (dispatched by auth.js) ── */
  window.addEventListener('app:login', async e => {
    await loadAll();
    currentUser = e.detail;
    showApp();
  });
}

/* ── Start ── */
boot();
