/* ══════════════════════════════════════════
   Teachers View
══════════════════════════════════════════ */
import { getTeachers, getClass } from '../api.js';

export function renderTeachers() {
  document.getElementById('teachers-grid').innerHTML = getTeachers().map(t => {
    const subjects = t.classIds.map(id => getClass(id)).filter(Boolean);

    return `<div class="teacher-card">
      <div class="tc-header">
        <div class="tc-avatar" style="background:linear-gradient(135deg,${t.color},${t.color}99)">
          ${t.initials}
        </div>
        <div>
          <div class="tc-name">${t.name}</div>
          <div class="tc-title">${t.title}</div>
        </div>
      </div>

      <div class="tc-contact">
        <div class="tc-contact-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          <a href="mailto:${t.email}">${t.email}</a>
        </div>
        <div class="tc-contact-row">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
          </svg>
          <a href="tel:${t.phone}">${t.phone}</a>
        </div>
      </div>

      <div class="tc-subjects">
        ${subjects.map(c => `
          <span class="tc-subj-pill" style="background:${c.color}18;color:${c.color};">
            <span class="tc-subj-dot" style="background:${c.color}"></span>
            ${c.subject}
          </span>`).join('')}
      </div>
    </div>`;
  }).join('');
}
