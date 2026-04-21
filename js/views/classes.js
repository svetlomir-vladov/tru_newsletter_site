/* ══════════════════════════════════════════
   Classes View
══════════════════════════════════════════ */
import { daysUntil } from '../utils.js';
import { DAYS } from '../config.js';
import { getClasses, getSchedule, getDeadlines } from '../api.js';

export function renderClasses() {
  $('classes-grid').innerHTML = getClasses().map(c => {
    const days = DAYS
      .filter(day => (getSchedule()[day] || []).some(p => p.classId === c.id))
      .map(d => d.slice(0, 1).toUpperCase() + d.slice(1, 3));

    const upcoming = getDeadlines()
      .filter(d => d.classId === c.id && daysUntil(d.date) >= 0).length;

    return `<div class="class-card">
      <div class="cc-bar" style="background:${c.color}"></div>
      <div class="cc-icon" style="background:${c.color}20">${c.icon}</div>
      <div class="cc-subj">${c.subject}</div>
      <div class="cc-teach">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        ${c.teacher}
      </div>
      <div class="cc-pills">
        <span class="info-pill">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          </svg>
          Room ${c.room}
        </span>
        ${days.length ? `<span class="info-pill">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
          ${days.join(' · ')}
        </span>` : ''}
        ${upcoming ? `<span class="info-pill" style="border-color:rgba(239,68,68,.3);color:var(--red)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4M12 16h.01"/>
          </svg>
          ${upcoming} upcoming
        </span>` : ''}
      </div>
    </div>`;
  }).join('');
}

// $ not imported from utils — inline since it's a single use
function $(id) { return document.getElementById(id); }
