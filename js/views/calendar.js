/* ══════════════════════════════════════════
   Deadlines / Calendar View
══════════════════════════════════════════ */
import { $, p, todayStr, daysUntil, toast, openModal, closeModal } from '../utils.js';
import { getDeadlines, getClasses, getClass, addDeadline, deleteDeadline } from '../api.js';
import { renderTodayStats, renderUpcomingDl } from './today.js';

let calendarDate = new Date();

/* ── Calendar grid ──────────────────────────── */
export function renderCalendar() {
  const y  = calendarDate.getFullYear();
  const mo = calendarDate.getMonth();
  $('cal-month').textContent = new Date(y, mo, 1).toLocaleDateString('en', {
    month: 'long', year: 'numeric',
  });

  const firstDay  = new Date(y, mo, 1).getDay();
  const daysInM   = new Date(y, mo + 1, 0).getDate();
  const daysInP   = new Date(y, mo, 0).getDate();
  const offset    = firstDay === 0 ? 6 : firstDay - 1;

  const dlMap = {};
  getDeadlines().forEach(d => {
    dlMap[d.date] = dlMap[d.date] || [];
    dlMap[d.date].push(d);
  });

  const ts  = todayStr();
  let html  = '';

  // Prev-month fill
  for (let i = offset - 1; i >= 0; i--) {
    html += `<div class="cal-day other-m"><div class="cal-dn">${daysInP - i}</div></div>`;
  }

  // Current month days
  for (let d = 1; d <= daysInM; d++) {
    const ds  = `${y}-${p(mo + 1)}-${p(d)}`;
    const dow = new Date(y, mo, d).getDay();
    const wkd = dow === 0 || dow === 6;
    const dots = (dlMap[ds] || []).map(dl => {
      const c = getClass(dl.classId);
      return `<span class="cal-dot" style="background:${c ? c.color : 'var(--ac)'}" title="${dl.title}"></span>`;
    }).join('');
    html += `<div class="cal-day ${ds === ts ? 'today' : ''} ${wkd ? 'weekend' : ''}" data-date="${ds}">
      <div class="cal-dn">${d}</div>
      <div class="cal-dots">${dots}</div>
    </div>`;
  }

  // Next-month fill
  const total = offset + daysInM;
  const rem   = total % 7 === 0 ? 0 : 7 - (total % 7);
  for (let d = 1; d <= rem; d++) {
    html += `<div class="cal-day other-m"><div class="cal-dn">${d}</div></div>`;
  }

  $('cal-days').innerHTML = html;
}

export function calNav(dir) {
  calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + dir, 1);
  renderCalendar();
}

function refreshBadge() {
  const n = getDeadlines().filter(d => {
    const days = daysUntil(d.date);
    return days >= 0 && days <= 3;
  }).length;
  const dot   = document.getElementById('notif-dot');
  const badge = document.getElementById('dl-badge');
  if (dot)   dot.classList.toggle('hidden', !n);
  if (badge) { badge.textContent = n; badge.classList.toggle('hidden', !n); }
}

/** Bind once — event delegation on the calendar grid. */
export function initCalendarView() {
  $('cal-days').addEventListener('click', e => {
    const cell = e.target.closest('[data-date]');
    if (!cell) return;
    const dls = getDeadlines().filter(d => d.date === cell.dataset.date);
    if (dls.length) toast(dls.map(d => d.title).join(' · '));
  });

  $('dl-list').addEventListener('click', async e => {
    const btn = e.target.closest('.dl-del-btn');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    try {
      await deleteDeadline(id);
      renderCalendar();
      renderDlList();
      renderUpcomingDl();
      renderTodayStats();
      refreshBadge();
    } catch {
      toast('Could not delete deadline.');
    }
  });

  $('cal-prev').addEventListener('click', () => calNav(-1));
  $('cal-next').addEventListener('click', () => calNav(1));
}

/* ── Deadline list ──────────────────────────── */
export function renderDlList() {
  const sorted = [...getDeadlines()].sort((a, b) => a.date.localeCompare(b.date));
  let html = '', lastM = '';

  sorted.forEach(d => {
    const dObj  = new Date(d.date + 'T12:00:00');
    const month = dObj.toLocaleDateString('en', { month: 'long', year: 'numeric' });
    if (month !== lastM) {
      html += `<div class="dl-sep">${month}</div>`;
      lastM = month;
    }
    const c    = getClass(d.classId);
    const days = daysUntil(d.date);
    const lbl  = days < 0 ? 'Past' : days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `${days}d`;
    const col  = days < 0 ? 'var(--t3)' : days <= 3 ? 'var(--orange)' : 'var(--t3)';

    html += `<div class="dl-row">
      <div class="dl-dot" style="background:${c ? c.color : 'var(--ac)'}"></div>
      <div class="dl-date">${dObj.toLocaleDateString('en', { day: 'numeric', month: 'short' })}</div>
      <div style="flex:1;min-width:0">
        <div class="dl-name">${d.title}</div>
        <div class="dl-note">${c ? c.subject : ''}${d.note ? ' · ' + d.note : ''}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0">
        <span class="dl-chip chip-${d.type}">${d.type}</span>
        <span style="font-size:11px;color:${col}">${lbl}</span>
      </div>
      <button class="dl-del-btn" data-id="${d.id}" aria-label="Delete deadline"
        style="background:none;border:none;cursor:pointer;color:var(--t3);font-size:18px;line-height:1;padding:0 4px;flex-shrink:0;margin-left:6px"
        title="Delete">×</button>
    </div>`;
  });

  $('dl-list').innerHTML = html || `<div class="empty-state"><p>No deadlines yet.</p></div>`;
}

/* ── Add deadline modal ─────────────────────── */
export function populateDlSelect() {
  $('dl-class').innerHTML = getClasses()
    .map(c => `<option value="${c.id}">${c.subject}</option>`)
    .join('');
}

export function openDlModal() {
  $('dl-date').value = todayStr();
  openModal('modal-dl');
}

export async function submitDeadline() {
  const title = $('dl-title').value.trim();
  const date  = $('dl-date').value;
  if (!title || !date) { toast('Please fill in title and date.'); return; }

  const deadline = {
    date,
    title,
    classId: $('dl-class').value,
    type:    $('dl-type').value,
    note:    $('dl-note').value.trim(),
  };

  try {
    await addDeadline(deadline);
    renderUpcomingDl();
    renderCalendar();
    renderDlList();
    renderTodayStats();
    closeModal('modal-dl');
    $('dl-title').value = '';
    $('dl-note').value  = '';
    toast(`"${title}" added.`);
  } catch {
    toast('Could not save deadline. Try again.');
  }
}

/** Bind modal buttons once. */
export function initDeadlineModal() {
  $('btn-add-dl').addEventListener('click', openDlModal);
  $('btn-close-modal-dl').addEventListener('click', () => closeModal('modal-dl'));
  $('btn-cancel-dl').addEventListener('click', () => closeModal('modal-dl'));
  $('btn-submit-dl').addEventListener('click', submitDeadline);
  $('modal-dl').addEventListener('click', e => {
    if (e.target === $('modal-dl')) closeModal('modal-dl');
  });
}
