/* ══════════════════════════════════════════
   API Client
   ─────────────────────────────────────────
   Set USE_MOCK = false and fill in API_BASE
   once your backend is running.
══════════════════════════════════════════ */

// ─── Toggle this flag when the backend is ready ──────────────────────────────
const USE_MOCK = true;
const API_BASE = '/api';
// ─────────────────────────────────────────────────────────────────────────────

/* ══════════════════════════════════════════
   Mock data — mirrors the backend seed exactly.
   Remove this block once the API is live.
══════════════════════════════════════════ */
const MOCK = {
  school: { name: 'Тракийски университет', class: '', year: '2025/2026' },

  students: [
    { id: '24050081000054', name: 'Пламен Тенев', initials: 'PT' },
    { id: '24050081000057', name: 'Кирил Димитров', initials: 'KD' },
    { id: '24050081000058', name: 'Иван Епитропов', initials: 'IE' },
    { id: '24050081000059', name: 'Михаил Богданов', initials: 'MB' },
    { id: '24050081000061', name: 'Александър Тсолис', initials: 'AT' },
    { id: '24050081000062', name: 'Ваня Михова', initials: 'VM' },
    { id: '24050081000063', name: 'Христо Георгиев', initials: 'HG' },
    { id: '24050081000064', name: 'Николай Георгиев', initials: 'NG' },
    { id: '24050081000065', name: 'Светломир Владов', initials: 'SV' },
    { id: '24050081000067', name: 'Костадин Донев', initials: 'KD' },
    { id: '24050081000074', name: 'Мирослав Бакалов', initials: 'MB' },
    { id: '24050081000076', name: 'Тоньо Димитров', initials: 'TD' },
  ],

  classes: [
    { id: 'pe_lec', subject: 'Програмни среди - Лекции', room: 'Стая ?', color: '#2563eb', icon: '💻' },
    { id: 'pe_exe', subject: 'Програмни среди - Упражнения', room: 'Джон Атанасов 2', color: '#2563eb', icon: '💻' },
    { id: 'sa_lec', subject: 'Софтуерни архитектури - Лекции', room: 'Стая ?', color: '#db2777', icon: '⚙️' },
    { id: 'sa_exe', subject: 'Софтуерни архитектури - Упражнения', room: 'Стая 383', color: '#db2777', icon: '⚙️' },
    { id: 'ibt2_lec', subject: 'Интернет базирани технологии II - Лекции', room: 'Зала 3', color: '#0891b2', icon: '🌐' },
    { id: 'ibt2_exe', subject: 'Интернет базирани технологии II - Упражнения', room: 'Джон Атанасов 2', color: '#0891b2', icon: '🌐' },
    { id: 'ct_lec', subject: 'Облачни технологии - Лекции', room: 'Стая ?', color: '#d97706', icon: '☁️' },
    { id: 'ct_exe', subject: 'Облачни технологии - Упражнения', room: 'Библиотека', color: '#d97706', icon: '☁️' },
    { id: 'prkp', subject: 'Правен режим на компютърните престъпления', room: 'Стая 361', color: '#dc2626', icon: '⚖️' },
    { id: 'sp', subject: 'Софтуерни шаблони', room: 'Джон Атанасов 2', color: '#059669', icon: '🧩' },
    { id: 'csharp', subject: 'Програмиране на C#', room: 'Джон Атанасов 2', color: '#7c3aed', icon: '🖥️' },
    { id: 'sport_f', subject: 'Физическо възпитание и спорт - жени', room: 'Салон', color: '#65a30d', icon: '🏃' },
    { id: 'sport_m', subject: 'Физическо възпитание и спорт - мъже', room: 'Салон', color: '#65a30d', icon: '🏃' },
  ],

  teachers: [
    { id: 'delinov', name: 'Емил Делинов', title: 'Доц. д-р', email: 'emil.delinov@trakia-uni.bg', phone: '0885556881', initials: 'ED', color: '#0284c7', classIds: ['ct_lec'] },
    { id: 'andonov', name: 'Венко Андонов', title: 'Гл. ас. д-р', email: 'vgandonov@gmail.com', phone: '', initials: 'VA', color: '#9333ea', classIds: ['pe_lec', 'sa_lec'] },
    { id: 'totev', name: 'Мирослав Тотев', title: 'Асистент', email: 'miroslav.totev@trakia-uni.bg', phone: '+359894318885', initials: 'MT', color: '#0f766e', classIds: ['pe_exe'] },
    { id: 'terziyski', name: 'Желязко Терзийски', title: 'Гл. ас. д-р', email: 'zhelyazko.terziyski@trakia-uni.bg', phone: '0888938215', initials: 'ZT', color: '#ea580c', classIds: ['ibt2_lec'] },
    { id: 'minchev', name: 'Андриян Минчев', title: 'Асистент', email: 'andrian.minchev@trakia-uni.bg', phone: '+359882514472', initials: 'AM', color: '#c026d3', classIds: ['ibt2_exe'] },
    { id: 'noncheva', name: 'Теодора Нончева', title: 'Асистент', email: 'teodora.noncheva@trakia-uni.bg', phone: '+359895971016', initials: 'TN', color: '#4f46e5', classIds: ['ct_exe'] },
    { id: 'milchev', name: 'Слави Милчев', title: 'Асистент', email: 'slavi.milchev@trakia-uni.bg', phone: '', initials: 'SM', color: '#16a34a', classIds: ['sa_exe', 'sport_f', 'sport_m'] },
    { id: 'ginin', name: 'Радослав Гинин', title: 'Гл. асистент', email: '', phone: '', initials: 'RG', color: '#ca8a04', classIds: ['sp', 'csharp'] },
    { id: 'trifonov', name: 'Николай Трифонов', title: 'Гл. асистент', email: '', phone: '', initials: 'NT', color: '#e11d48', classIds: ['prkp'] },
  ],

  schedule: {
    monday: [
      { time: '11:15', endTime: '13:00', classId: 'prkp' },
      { time: '13:15', endTime: '16:00', classId: 'sp' },
      { time: '16:15', endTime: '19:00', classId: 'csharp' },
    ],
    tuesday: [
      { time: '13:00', endTime: '14:00', classId: 'sport_m' },
      { time: '15:30', endTime: '17:00', classId: 'sa_exe' },
      { time: '17:15', endTime: '19:00', classId: 'pe_exe' },
    ],
    wednesday: [
      { time: '10:15', endTime: '12:00', classId: 'ibt2_lec' },
      { time: '12:15', endTime: '13:15', classId: 'sport_f' },
      { time: '13:30', endTime: '15:15', classId: 'ct_exe' },
    ],
    thursday: [
      { time: '09:15', endTime: '11:00', classId: 'ibt2_exe' },
      { time: '11:30', endTime: '12:30', classId: 'sport_m' },
    ],
    friday: [],
  },

  deadlines: [
    { date: '2026-04-28', title: 'Личен проект', classId: 'sa_exe', type: 'presentation', note: '4 готови задачи + проект' },
    { date: '2026-04-28', title: 'Групов проект', classId: 'pe_exe', type: 'presentation', note: '' },
    { date: '2026-04-28', title: 'Личен проект', classId: 'ibt2_exe', type: 'presentation', note: '' },
  ],
};
/* ─── end mock data ─────────────────────────────────────────────────────────── */

/** In-memory cache; populated by loadAll(). */
let _cache = null;

/* ══════════════════════════════════════════
   Public API functions
   Each function has two branches:
     • USE_MOCK = true  → return data from MOCK
     • USE_MOCK = false → call the real REST endpoint
══════════════════════════════════════════ */

/**
 * Load all initial data for the app.
 * Call once on boot; subsequent calls return the cached result.
 */
export async function loadAll() {
  if (_cache) return _cache;

  if (USE_MOCK) {
    // Deep clone so views can mutate deadlines without corrupting the source
    _cache = JSON.parse(JSON.stringify(MOCK));
    return _cache;
  }

  const [classes, schedule, teachers, deadlines] = await Promise.all([
    fetch(`${API_BASE}/classes`).then(r => r.json()),
    fetch(`${API_BASE}/schedule`).then(r => r.json()),
    fetch(`${API_BASE}/teachers`).then(r => r.json()),
    fetch(`${API_BASE}/deadlines`).then(r => r.json()),
  ]);
  _cache = { classes, schedule, teachers, deadlines };
  return _cache;
}

/**
 * Authenticate a student by ID.
 * @returns {Promise<object|null>} student object or null if not found
 *
 * Backend endpoint: POST /api/auth/login  { studentId }
 * Expected response: { user: { id, name, initials } }
 */
export async function loginStudent(studentId) {
  if (USE_MOCK) {
    return MOCK.students.find(s => s.id === studentId) ?? null;
  }
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId }),
  });
  if (!res.ok) return null;
  const { user } = await res.json();
  return user;
}

/**
 * Persist a new deadline.
 * @param {{ date, title, classId, type, note }} deadline
 * @returns {Promise<object>} saved deadline (may include server-generated id)
 *
 * Backend endpoint: POST /api/deadlines
 * Expected response: the saved deadline object
 */
export async function addDeadline(deadline) {
  if (USE_MOCK) {
    _cache.deadlines.push(deadline);
    return deadline;
  }
  const res = await fetch(`${API_BASE}/deadlines`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(deadline),
  });
  if (!res.ok) throw new Error('Failed to save deadline');
  const saved = await res.json();
  _cache.deadlines.push(saved);
  return saved;
}

/* ── Cache accessors (used by view modules) ── */
export const getData      = () => _cache;
export const getClasses   = () => _cache?.classes   ?? [];
export const getSchedule  = () => _cache?.schedule  ?? {};
export const getTeachers  = () => _cache?.teachers  ?? [];
export const getDeadlines = () => _cache?.deadlines ?? [];
export const getSchool    = () => _cache?.school    ?? {};
export const getClass     = id => _cache?.classes.find(c => c.id === id);
