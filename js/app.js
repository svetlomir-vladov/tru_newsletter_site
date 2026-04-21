/* ══════════════════════════════════════════
   app.js — Main entry point
   Boots the app, wires up all events,
   and orchestrates view rendering.
══════════════════════════════════════════ */
import { $, toast, closeModal } from './utils.js';
import { loadAll, getDeadlines } from './api.js';
import { daysUntil } from './utils.js';

import { handleLogin, quickLogin, handleLogout, getStoredUser } from './auth.js';

import { initTodayView, renderGreeting, renderDayPicker, renderTodayStats, renderTimeline, renderUpcomingDl } from './views/today.js';
import { renderClasses }                                                                                        from './views/classes.js';
import { renderTimetable, renderMobileTimetable, initTimetableView }                                           from './views/timetable.js';
import { renderCalendar, renderDlList, populateDlSelect, initCalendarView, initDeadlineModal }                 from './views/calendar.js';
import { renderTeachers }                                                                                       from './views/teachers.js';

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

  $('user-av').textContent = currentUser.initials;
  $('user-nm').textContent = currentUser.name.split(' ')[0];

  renderGreeting(currentUser);
  renderDayPicker();
  renderTodayStats();
  renderTimeline();
  renderUpcomingDl();
  renderClasses();
  renderTimetable();
  renderMobileTimetable();
  renderCalendar();
  renderDlList();
  renderTeachers();
  populateDlSelect();
  checkUrgent();
  startClock();
}

function hideApp() {
  $('app').style.display        = 'none';
  $('login-page').style.display = 'flex';
  $('sid-input').value          = '';
}

/* ══════════════════════════════════════════
   Navigation
══════════════════════════════════════════ */
function switchView(name, btn) {
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  ['today', 'classes', 'timetable', 'calendar', 'teachers'].forEach(v => {
    const el = $(`view-${v}`);
    if (v === name) {
      el.classList.remove('hidden');
      el.classList.add('view-enter');
      void el.offsetWidth; // force reflow for animation restart
    } else {
      el.classList.add('hidden');
      el.classList.remove('view-enter');
    }
  });
}

/* ══════════════════════════════════════════
   Notifications
══════════════════════════════════════════ */
function checkUrgent() {
  const n = getDeadlines().filter(d => {
    const days = daysUntil(d.date);
    return days >= 0 && days <= 3;
  }).length;
  if (n) {
    $('notif-dot').classList.remove('hidden');
    $('dl-badge').textContent = n;
    $('dl-badge').classList.remove('hidden');
  }
}

function showNotifs() {
  const urgent = getDeadlines().filter(d => {
    const days = daysUntil(d.date);
    return days >= 0 && days <= 3;
  });
  if (!urgent.length) { toast('No urgent notifications.'); return; }
  toast(`⚠️ ${urgent.length} deadline${urgent.length > 1 ? 's' : ''} in the next 3 days!`);
  const calTab = document.querySelector('.nav-tab[data-view="calendar"]');
  if (calTab) switchView('calendar', calTab);
}

/* ══════════════════════════════════════════
   Clock
══════════════════════════════════════════ */
function startClock() {
  const tick = () => {
    $('live-clock').textContent = new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
  };
  tick();
  setInterval(tick, 1000);
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

  /* ── App shell ── */
  $('btn-logout').addEventListener('click', handleLogout);
  $('btn-notif').addEventListener('click', showNotifs);

  /* ── Nav tabs ── */
  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view, btn));
  });

  /* ── Global modal Escape key ── */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m.id));
    }
  });

  /* ── Auth events (dispatched by auth.js) ── */
  window.addEventListener('app:login', async e => {
    await loadAll();
    currentUser = e.detail;
    showApp();
  });
  window.addEventListener('app:logout', hideApp);

  /* ── View-specific bindings ── */
  initTodayView();
  initTimetableView();
  initCalendarView();
  initDeadlineModal();
}

/* ── Start ── */
boot();
