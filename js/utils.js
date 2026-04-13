/* ══════════════════════════════════════════
   Shared utility helpers
══════════════════════════════════════════ */
import { GRID_START, PPM } from './config.js';

/* ── DOM shorthand ── */
export const $ = id => document.getElementById(id);

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
