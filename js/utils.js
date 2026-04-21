/* ══════════════════════════════════════════
   Shared utility helpers
══════════════════════════════════════════ */
import { GRID_START, PPM } from './config.js';

/* ── DOM shorthand ── */
export const $ = id => document.getElementById(id);

/* ── Number/string helpers ── */
export const p       = n => String(n).padStart(2, '0');
export const toMins  = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
export const nowMins = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };

/* ── Timetable positioning ── */
export const topPx = t => (toMins(t) - GRID_START) * PPM;
export const hPx   = (s, e) => (toMins(e) - toMins(s)) * PPM;

/* ── Date helpers ── */
export const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

export const daysUntil = dateStr =>
  Math.round((new Date(dateStr) - new Date(todayStr())) / 86400000);

/** Returns 0–4 (Mon–Fri). Falls back to 0 on weekends. */
export const todayDayIdx = () => {
  const d = new Date().getDay();
  return d === 0 || d === 6 ? 0 : d - 1;
};

/* ── Toast notifications ── */
export function toast(msg) {
  const t = document.createElement('div');
  t.className  = 'toast';
  t.textContent = msg;
  $('toast-wrap').appendChild(t);
  setTimeout(() => {
    t.classList.add('out');
    t.addEventListener('animationend', () => t.remove());
  }, 3500);
}

/* ── Modal helpers ── */
export function openModal(id) {
  $(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}
export function closeModal(id) {
  $(id).classList.remove('open');
  document.body.style.overflow = '';
}
