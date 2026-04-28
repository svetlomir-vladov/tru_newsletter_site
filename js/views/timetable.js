/* ══════════════════════════════════════════
   Timetable View — desktop grid + mobile list
══════════════════════════════════════════ */
import { p, todayDayIdx, toMins, nowMins, topPx, hPx } from '../utils.js';
import { DAYS, DAY_ABBR, DAY_FULL, GRID_START, GRID_END, PPM, GRID_H } from '../config.js';
import { getSchedule, getClass } from '../api.js';

/* ─── Mobile state ───────────────────────────── */
let mobileTTDay = todayDayIdx();
let nowTimerId = null;

/* ════════════════════════════════════════
   Desktop — proportional time grid
════════════════════════════════════════ */
export function renderTimetable() {
  const todayIdx = todayDayIdx();
  const wrap     = document.getElementById('tt-wrap');
  wrap.innerHTML = '';

  if (nowTimerId !== null) {
    clearInterval(nowTimerId);
    nowTimerId = null;
  }

  // Hour marks for the time axis (every 30 min)
  const hourMarks = [];
  for (let m = GRID_START; m <= GRID_END; m += 30) hourMarks.push(m);

  /* ── Outer container ── */
  const container = document.createElement('div');
  container.style.cssText = [
    'display:flex',
    'flex-direction:column',
    'background:var(--s1)',
    'border:1px solid var(--b1)',
    'border-radius:14px',
    'overflow:hidden',
    'min-width:680px',
  ].join(';');

  /* ── Header row ── */
  const header = document.createElement('div');
  header.style.cssText = 'display:grid;grid-template-columns:52px repeat(5,1fr);border-bottom:1px solid var(--b1);flex-shrink:0;';
  header.innerHTML = `
    <div style="background:var(--s2);border-right:1px solid var(--b1);padding:10px 0;"></div>
    ${DAYS.map((_, i) => {
      const today = i === todayIdx;
      return `<div class="tt-head-day ${today ? 'tt-today-col' : ''}" style="${i === 4 ? 'border-right:none' : ''}">
        ${DAY_FULL[i]}
        ${today ? `<span style="display:inline-block;margin-left:5px;width:6px;height:6px;border-radius:50%;background:var(--ac);vertical-align:middle"></span>` : ''}
      </div>`;
    }).join('')}
  `;
  container.appendChild(header);

  /* ── Body row (time axis + day columns) ── */
  const body = document.createElement('div');
  body.style.cssText = `display:grid;grid-template-columns:52px repeat(5,1fr);height:${GRID_H}px;`;

  /* Time axis */
  const timeCol = document.createElement('div');
  timeCol.className  = 'tt-time-col';
  timeCol.style.cssText = `height:${GRID_H}px;position:relative;`;
  hourMarks.forEach(m => {
    const top = (m - GRID_START) * PPM;
    const lbl = document.createElement('div');
    lbl.className = 'tt-hour-label';
    lbl.style.top = `${top}px`;
    lbl.textContent = `${p(Math.floor(m / 60))}:${p(m % 60)}`;
    timeCol.appendChild(lbl);
  });
  body.appendChild(timeCol);

  /* Day columns */
  DAYS.forEach((day, di) => {
    const isToday = di === todayIdx;
    const col     = document.createElement('div');
    col.className = `tt-day-col ${isToday ? 'tt-today-col' : ''}`;
    col.style.cssText = `height:${GRID_H}px;position:relative;${di === 4 ? 'border-right:none' : ''}`;

    /* Hour lines */
    hourMarks.forEach(m => {
      const line       = document.createElement('div');
      line.className   = `tt-hour-line ${m % 60 !== 0 ? 'half' : ''}`;
      line.style.top   = `${(m - GRID_START) * PPM}px`;
      col.appendChild(line);
    });

    /* Current-time indicator */
    if (isToday) {
      const nm = nowMins();
      if (nm >= GRID_START && nm <= GRID_END) {
        const nowLine     = document.createElement('div');
        nowLine.className = 'tt-now-line';
        nowLine.style.top = `${(nm - GRID_START) * PPM}px`;
        col.appendChild(nowLine);
        nowTimerId = setInterval(() => {
          const n = nowMins();
          nowLine.style.top = `${(n - GRID_START) * PPM}px`;
        }, 60_000);
      }
    }

    /* Periods */
    (getSchedule()[day] || []).forEach(period => {
      const t = topPx(period.time);
      const h = hPx(period.time, period.endTime);
      if (h <= 0) return;

      if (!period.classId) {
        const brk         = document.createElement('div');
        brk.className     = 'tt-break';
        brk.style.cssText = `top:${t}px;height:${h}px;`;
        brk.innerHTML     = `<span>${period.label || 'Break'}</span>`;
        col.appendChild(brk);
      } else {
        const c = getClass(period.classId);
        if (!c) return;
        const block       = document.createElement('div');
        block.className   = 'tt-block';
        block.title       = `${c.subject} · ${period.time}–${period.endTime} · Room ${c.room} · ${c.teacher}`;
        block.style.cssText = `top:${t + 2}px;height:${h - 4}px;background:${c.color}18;border-left-color:${c.color};color:var(--t1);`;
        block.innerHTML   = `
          <div class="tt-block-name">${c.subject}</div>
          ${h > 28 ? `<div class="tt-block-room">Room ${c.room}</div>` : ''}
          ${h > 44 ? `<div class="tt-block-teacher">${c.teacher}</div>` : ''}
          ${h > 60 ? `<div class="tt-block-time">${period.time} – ${period.endTime}</div>` : ''}
        `;
        col.appendChild(block);
      }
    });

    body.appendChild(col);
  });

  container.appendChild(body);
  wrap.appendChild(container);
}

/* ════════════════════════════════════════
   Mobile — single-day list
════════════════════════════════════════ */
export function renderMobileTimetable() {
  const mob      = document.getElementById('tt-mobile');
  const todayIdx = todayDayIdx();

  /* Day picker */
  const picker = `
    <div class="tt-mobile-daypicker">
      <button class="ttm-arrow" data-mtt-dir="-1" ${mobileTTDay === 0 ? 'disabled' : ''} aria-label="Previous day">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <div class="ttm-days">
        ${DAYS.map((_, i) => `
          <button class="ttm-day ${i === mobileTTDay ? 'active' : ''} ${i === todayIdx ? 'today-day' : ''}"
            data-mtt-day="${i}">
            <span class="ltr">${DAY_ABBR[i]}</span>
          </button>`).join('')}
      </div>
      <button class="ttm-arrow" data-mtt-dir="1" ${mobileTTDay === 4 ? 'disabled' : ''} aria-label="Next day">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </div>`;

  /* Period list */
  const sched   = getSchedule()[DAYS[mobileTTDay]] || [];
  const nm      = nowMins();
  const isToday = mobileTTDay === todayIdx;

  const list = sched.length
    ? sched.map(period => {
        const isBreak   = !period.classId;
        const sM        = toMins(period.time);
        const eM        = toMins(period.endTime);
        const isPast    = isToday && nm >= eM;
        const isCurrent = isToday && nm >= sM && nm < eM;
        const durMins   = eM - sM;

        if (isBreak) {
          return `<div class="ttm-block break-row">
            <div class="ttm-accent" style="background:var(--s3)"></div>
            <div class="ttm-time">${period.time}</div>
            <div class="ttm-info"><div class="ttm-name" style="font-size:13px;opacity:.6">${period.label || 'Break'}</div></div>
            <span class="ttm-dur">${durMins}m</span>
          </div>`;
        }

        const c = getClass(period.classId);
        if (!c) return '';
        const currentStyle = isCurrent ? 'border-color:var(--ac);background:rgba(99,102,241,.06)' : '';
        return `<div class="ttm-block" style="${currentStyle}${isPast ? ';opacity:.4' : ''}">
          <div class="ttm-accent" style="background:${c.color}"></div>
          <div class="ttm-time">${period.time}<br><span style="opacity:.55">${period.endTime}</span></div>
          <div class="ttm-info">
            <div class="ttm-name">${c.subject}</div>
            <div class="ttm-detail">
              <span>${c.teacher}</span>
              <span>Room ${c.room}</span>
              ${isCurrent ? '<span style="color:var(--ac);font-weight:700">NOW</span>' : ''}
            </div>
          </div>
          <span class="ttm-dur">${durMins}m</span>
        </div>`;
      }).join('')
    : `<div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        <strong>No classes</strong><p>Free day!</p>
      </div>`;

  mob.innerHTML = picker + `<div class="tt-mobile-list">${list}</div>`;
}

export function mttSelect(idx) {
  mobileTTDay = idx;
  renderMobileTimetable();
}
export function mttNav(dir) {
  const n = mobileTTDay + dir;
  if (n >= 0 && n <= 4) mttSelect(n);
}

/** Bind once — event delegation on the mobile timetable container. */
export function initTimetableView() {
  document.getElementById('tt-mobile').addEventListener('click', e => {
    const dayBtn = e.target.closest('[data-mtt-day]');
    const dirBtn = e.target.closest('[data-mtt-dir]');
    if (dayBtn) mttSelect(Number(dayBtn.dataset.mttDay));
    if (dirBtn) mttNav(Number(dirBtn.dataset.mttDir));
  });
}