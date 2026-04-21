/* ══════════════════════════════════════════
   Today View — greeting, day picker, timeline, upcoming deadlines
══════════════════════════════════════════ */
import { $, p, todayStr, daysUntil, todayDayIdx, toMins, nowMins } from '../utils.js';
import { DAYS, DAY_ABBR, DAY_FULL } from '../config.js';
import { getSchedule, getDeadlines, getClasses, getClass } from '../api.js';

/** Currently selected day index (0 = Mon … 4 = Fri). Module-level state. */
let selectedDay = todayDayIdx();

/* ── Greeting ───────────────────────────────── */
export function renderGreeting(user) {
  const h = new Date().getHours();
  const g = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  $('greeting-msg').textContent  = `${g}, ${user.name.split(' ')[0]}!`;
  $('greeting-date').textContent = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

/* ── Day picker ─────────────────────────────── */
export function renderDayPicker() {
  const todayIdx = todayDayIdx();
  $('dp-days').innerHTML = DAYS.map((_, i) => `
    <button
      class="dp-day ${i === selectedDay ? 'active' : ''} ${i === todayIdx ? 'is-today' : ''}"
      data-day="${i}"
      aria-label="${DAY_FULL[i]}"
    >${DAY_ABBR[i]}</button>
  `).join('');
  $('dp-prev').disabled = selectedDay === 0;
  $('dp-next').disabled = selectedDay === 4;
}

export function selectDay(idx) {
  selectedDay = idx;
  renderDayPicker();
  renderTimeline();
  renderTodayStats();
  const label = idx === todayDayIdx()
    ? "Today's Schedule"
    : `${DAY_FULL[idx]}'s Schedule`;
  // First child text node holds the label text (::after is the line via CSS)
  $('timeline-label').childNodes[0].textContent = label + ' ';
}

export function dayNav(dir) {
  const next = selectedDay + dir;
  if (next >= 0 && next <= 4) selectDay(next);
}

/** Bind once — event delegation for the day buttons container. */
export function initTodayView() {
  $('dp-prev').addEventListener('click', () => dayNav(-1));
  $('dp-next').addEventListener('click', () => dayNav(1));
  $('dp-days').addEventListener('click', e => {
    const btn = e.target.closest('[data-day]');
    if (btn) selectDay(Number(btn.dataset.day));
  });
}

/* ── Stats chips ────────────────────────────── */
export function renderTodayStats() {
  const sched   = getSchedule()[DAYS[selectedDay]] || [];
  const lessons = sched.filter(p => p.classId).length;
  const urgent  = getDeadlines().filter(d => {
    const n = daysUntil(d.date);
    return n >= 0 && n <= 7;
  }).length;
  $('today-stats').innerHTML = `
    <div class="stat-chip">
      <div class="stat-chip-val" style="color:var(--ac)">${lessons}</div>
      <div class="stat-chip-lbl">Classes</div>
    </div>
    <div class="stat-chip">
      <div class="stat-chip-val" style="color:var(--orange)">${urgent}</div>
      <div class="stat-chip-lbl">Due this week</div>
    </div>
    <div class="stat-chip">
      <div class="stat-chip-val" style="color:var(--green)">${getClasses().length}</div>
      <div class="stat-chip-lbl">Subjects</div>
    </div>
  `;
}

/* ── Timeline ───────────────────────────────── */
export function renderTimeline() {
  const sched   = getSchedule()[DAYS[selectedDay]] || [];
  const nm      = nowMins();
  const isToday = selectedDay === todayDayIdx();
  const el      = $('timeline');

  if (!sched.length) {
    el.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        <strong>No classes</strong>
        <p>Nothing scheduled for ${DAY_FULL[selectedDay]}.</p>
      </div>`;
    return;
  }

  let nextFound = false;
  el.innerHTML  = sched.map(period => {
    const sM        = toMins(period.time);
    const eM        = toMins(period.endTime);
    const isCurrent = isToday && nm >= sM && nm < eM;
    const isPast    = isToday && nm >= eM;
    const isNext    = isToday && !isPast && !isCurrent && !nextFound;
    if (isNext) nextFound = true;
    const durMins   = eM - sM;

    if (!period.classId) {
      return `<div class="tl-item free ${isPast ? 'past' : ''}">
        <div class="tl-bar" style="background:var(--s3)"></div>
        <div class="tl-time">${period.time}</div>
        <div class="tl-body">
          <span style="font-size:12px;color:var(--t3);font-style:italic">
            ${period.label || 'Break'} · ${durMins}min
          </span>
        </div>
      </div>`;
    }

    const c    = getClass(period.classId);
    if (!c) return '';
    const badge = isCurrent
      ? '<span class="tl-badge now">NOW</span>'
      : isNext ? '<span class="tl-badge next">NEXT</span>' : '';

    return `<div class="tl-item ${isCurrent ? 'current' : ''} ${isPast ? 'past' : ''}">
      <div class="tl-bar" style="background:${c.color}"></div>
      <div class="tl-time">${period.time}<br><span style="opacity:.55">${period.endTime}</span></div>
      <div class="tl-body">
        <div class="tl-subj">${c.subject}</div>
        <div class="tl-meta">
          <span>${c.teacher}</span>
          <span>Room ${c.room}</span>
          <span>${durMins}min</span>
        </div>
      </div>
      ${badge}
    </div>`;
  }).join('');
}

/* ── Upcoming deadlines panel ───────────────── */
export function renderUpcomingDl() {
  const sorted = [...getDeadlines()]
    .filter(d => daysUntil(d.date) >= 0)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);
  const el = $('upcoming-dl');

  if (!sorted.length) {
    el.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
        <strong>All clear!</strong>
        <p>No upcoming deadlines.</p>
      </div>`;
    return;
  }

  el.innerHTML = sorted.map(d => {
    const c         = getClass(d.classId);
    const days      = daysUntil(d.date);
    const dObj      = new Date(d.date + 'T12:00:00');
    const away      = days === 0 ? 'TODAY' : days === 1 ? 'Tomorrow' : `${days} days`;
    const awayColor = days === 0 ? 'var(--red)' : days <= 3 ? 'var(--orange)' : 'var(--t3)';

    return `<div class="dl-card">
      <div class="dl-datebox" style="border-top:2px solid ${c ? c.color : 'var(--ac)'}">
        <div class="mo">${dObj.toLocaleDateString('en', { month: 'short' })}</div>
        <div class="dy">${dObj.getDate()}</div>
      </div>
      <div class="dl-info">
        <div class="dl-title">${d.title}</div>
        <div class="dl-sub">${c ? c.subject : ''}${d.note ? ' · ' + d.note : ''}</div>
        <div class="dl-away" style="color:${awayColor}">${away}</div>
      </div>
      <span class="dl-chip chip-${d.type}">${d.type}</span>
    </div>`;
  }).join('');
}
