const API_BASE = '/api';

let _cache = null;

function attachTeachers(data) {
  const teacherByClassId = new Map();
  (data.teachers || []).forEach(teacher => {
    (teacher.classIds || []).forEach(classId => teacherByClassId.set(classId, teacher.name));
  });
  return {
    ...data,
    classes: (data.classes || []).map(cls => ({
      ...cls,
      teacher: cls.teacher || teacherByClassId.get(cls.id) || '',
    })),
  };
}

export async function loadAll() {
  if (_cache) return _cache;
  const res = await fetch(`${API_BASE}/data.php`);
  if (!res.ok) throw new Error('Failed to load data');
  const data = await res.json();
  _cache = attachTeachers(data);
  return _cache;
}

export function clearCache() {
  _cache = null;
}

export async function loginStudent(studentId) {
  const res = await fetch(`${API_BASE}/login.php`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ id: studentId }),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function logoutUser() {
  clearCache();
  await fetch(`${API_BASE}/logout.php`, { method: 'POST' });
}

export async function currentUser() {
  const res = await fetch(`${API_BASE}/me.php`);
  if (!res.ok) return null;
  return res.json();
}

export async function addDeadline(deadline) {
  const res = await fetch(`${API_BASE}/deadlines.php`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(deadline),
  });
  if (!res.ok) throw new Error('Failed to save deadline');
  const saved = await res.json();
  _cache.deadlines.push(saved);
  return saved;
}

export async function deleteDeadline(id) {
  const res = await fetch(`${API_BASE}/deadlines.php?id=${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete deadline');
  _cache.deadlines = _cache.deadlines.filter(d => d.id !== id);
}

export const getData      = () => _cache;
export const getClasses   = () => _cache?.classes   ?? [];
export const getSchedule  = () => _cache?.schedule  ?? {};
export const getTeachers  = () => _cache?.teachers  ?? [];
export const getDeadlines = () => _cache?.deadlines ?? [];
export const getSchool    = () => _cache?.school    ?? {};
export const getClass     = id => _cache?.classes.find(c => c.id === id);
