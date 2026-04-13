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
  school: { name: 'Lincoln High School', class: '10-B', year: '2024/2025' },

  students: [
    { id: '2024001', name: 'Alex Johnson',  initials: 'AJ' },
    { id: '2024007', name: 'Maria Garcia',  initials: 'MG' },
    { id: '2024015', name: 'Sam Patel',     initials: 'SP' },
    { id: '2024023', name: 'Jordan Lee',    initials: 'JL' },
    { id: '2024031', name: 'Chris Evans',   initials: 'CE' },
    { id: '2024042', name: 'Priya Singh',   initials: 'PS' },
  ],

  classes: [
    { id: 'math',  subject: 'Mathematics',        teacher: 'Mr. Davidson',   room: '204',    color: '#6366f1', icon: '📐' },
    { id: 'cs',    subject: 'Computer Science',   teacher: 'Dr. Patel',      room: 'Lab B3', color: '#8b5cf6', icon: '💻' },
    { id: 'phys',  subject: 'Physics',            teacher: 'Prof. Chen',     room: '112',    color: '#f97316', icon: '⚛️' },
    { id: 'lit',   subject: 'Literature',         teacher: 'Ms. Torres',     room: '301',    color: '#22c55e', icon: '📚' },
    { id: 'chem',  subject: 'Chemistry',          teacher: 'Dr. Morgan',     room: 'Lab C1', color: '#ef4444', icon: '🧪' },
    { id: 'hist',  subject: 'History',            teacher: 'Mrs. Okafor',    room: '405',    color: '#eab308', icon: '🏛️' },
    { id: 'pe',    subject: 'Physical Education', teacher: 'Coach Williams', room: 'Gym',    color: '#06b6d4', icon: '🏃' },
    { id: 'art',   subject: 'Art',                teacher: 'Ms. Dubois',     room: 'Studio', color: '#ec4899', icon: '🎨' },
  ],

  teachers: [
    { id: 'davidson', name: 'Mr. Davidson',   title: 'Mathematics Teacher',        email: 'davidson@lincoln.edu',  phone: '+1 (555) 204-0101', classIds: ['math'], initials: 'JD', color: '#6366f1' },
    { id: 'patel',    name: 'Dr. Patel',      title: 'Computer Science Teacher',   email: 'patel@lincoln.edu',     phone: '+1 (555) 204-0202', classIds: ['cs'],   initials: 'RP', color: '#8b5cf6' },
    { id: 'chen',     name: 'Prof. Chen',     title: 'Physics Teacher',            email: 'chen@lincoln.edu',      phone: '+1 (555) 204-0303', classIds: ['phys'], initials: 'LC', color: '#f97316' },
    { id: 'torres',   name: 'Ms. Torres',     title: 'Literature Teacher',         email: 'torres@lincoln.edu',    phone: '+1 (555) 204-0404', classIds: ['lit'],  initials: 'AT', color: '#22c55e' },
    { id: 'morgan',   name: 'Dr. Morgan',     title: 'Chemistry Teacher',          email: 'morgan@lincoln.edu',    phone: '+1 (555) 204-0505', classIds: ['chem'], initials: 'KM', color: '#ef4444' },
    { id: 'okafor',   name: 'Mrs. Okafor',    title: 'History Teacher',            email: 'okafor@lincoln.edu',    phone: '+1 (555) 204-0606', classIds: ['hist'], initials: 'NO', color: '#eab308' },
    { id: 'williams', name: 'Coach Williams', title: 'Physical Education Teacher', email: 'williams@lincoln.edu',  phone: '+1 (555) 204-0707', classIds: ['pe'],   initials: 'TW', color: '#06b6d4' },
    { id: 'dubois',   name: 'Ms. Dubois',     title: 'Art Teacher',                email: 'dubois@lincoln.edu',    phone: '+1 (555) 204-0808', classIds: ['art'],  initials: 'CD', color: '#ec4899' },
  ],

  schedule: {
    monday:    [
      { time: '08:00', endTime: '08:45', classId: 'math' },
      { time: '08:50', endTime: '09:35', classId: 'phys' },
      { time: '09:35', endTime: '09:55', classId: null, label: 'Break' },
      { time: '09:55', endTime: '10:40', classId: 'lit'  },
      { time: '10:45', endTime: '11:30', classId: 'hist' },
      { time: '11:30', endTime: '12:15', classId: null, label: 'Lunch' },
      { time: '12:15', endTime: '13:00', classId: 'chem' },
      { time: '13:05', endTime: '13:50', classId: 'pe'   },
    ],
    tuesday:   [
      { time: '08:00', endTime: '08:45', classId: 'cs'   },
      { time: '08:50', endTime: '09:35', classId: 'math' },
      { time: '09:35', endTime: '09:55', classId: null, label: 'Break' },
      { time: '09:55', endTime: '10:40', classId: 'chem' },
      { time: '10:45', endTime: '11:30', classId: 'art'  },
      { time: '11:30', endTime: '12:15', classId: null, label: 'Lunch' },
      { time: '12:15', endTime: '13:00', classId: 'phys' },
      { time: '13:05', endTime: '13:50', classId: 'lit'  },
    ],
    wednesday: [
      { time: '08:00', endTime: '08:45', classId: 'hist' },
      { time: '08:50', endTime: '09:35', classId: 'math' },
      { time: '09:35', endTime: '09:55', classId: null, label: 'Break' },
      { time: '09:55', endTime: '10:40', classId: 'cs'   },
      { time: '10:45', endTime: '11:30', classId: 'chem' },
      { time: '11:30', endTime: '12:15', classId: null, label: 'Lunch' },
      { time: '12:15', endTime: '13:00', classId: 'lit'  },
      { time: '13:05', endTime: '13:50', classId: 'pe'   },
    ],
    thursday:  [
      { time: '08:00', endTime: '08:45', classId: 'phys' },
      { time: '08:50', endTime: '09:35', classId: 'cs'   },
      { time: '09:35', endTime: '09:55', classId: null, label: 'Break' },
      { time: '09:55', endTime: '10:40', classId: 'math' },
      { time: '10:45', endTime: '11:30', classId: 'hist' },
      { time: '11:30', endTime: '12:15', classId: null, label: 'Lunch' },
      { time: '12:15', endTime: '13:00', classId: 'art'  },
      { time: '13:05', endTime: '13:50', classId: 'chem' },
    ],
    friday:    [
      { time: '08:00', endTime: '08:45', classId: 'math' },
      { time: '08:50', endTime: '09:35', classId: 'lit'  },
      { time: '09:35', endTime: '09:55', classId: null, label: 'Break' },
      { time: '09:55', endTime: '10:40', classId: 'phys' },
      { time: '10:45', endTime: '11:30', classId: 'cs'   },
      { time: '11:30', endTime: '12:15', classId: null, label: 'Lunch' },
      { time: '12:15', endTime: '13:00', classId: 'hist' },
      { time: '13:05', endTime: '13:50', classId: 'art'  },
    ],
  }
};
/* ─── end mock data ─────────────────────────────────────────────────────────── */

let _cache = null;

/**
 * Authenticate a student by ID.
 * @returns {Promise<object|null>} student object or null if not found
 *
 * Backend endpoint: POST /api/auth/login  { studentId }
 * Expected response: { user: { id, name, initials } }
 */

export async function loadAll() {
  if (_cache) return _cache;

  if (USE_MOCK) {
    // Deep clone so views can mutate deadlines without corrupting the source
    _cache = JSON.parse(JSON.stringify(MOCK));
    return _cache;
  }

  const [schedule] = await Promise.all([
    fetch(`${API_BASE}/schedule`).then(r => r.json()),
  ]);
  _cache = { schedule };
  return _cache;
}

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
