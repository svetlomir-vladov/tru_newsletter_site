/* ══════════════════════════════════════════
   Authentication — login / logout / session
══════════════════════════════════════════ */
import { $, toast } from './utils.js';
import { loginStudent } from './api.js';

const SESSION_KEY = 'cb_user';

/**
 * Attempt login with the value currently in #sid-input.
 * Called by the Sign In button.
 */
export async function handleLogin() {
  await doLogin($('sid-input').value.trim());
}

/**
 * Fill the input and log in immediately (demo buttons).
 * @param {string} id  student ID
 */
export async function quickLogin(id) {
  $('sid-input').value = id;
  await doLogin(id);
}

/**
 * Core login logic. On success:
 *   - saves user to sessionStorage
 *   - dispatches 'app:login' so app.js can boot the UI
 *
 * @param {string} id  student ID
 */
export async function doLogin(id) {
  const student = await loginStudent(id);

  if (!student) {
    $('sid-input').classList.add('error');
    $('login-err').classList.add('show');
    $('sid-input').focus();
    return;
  }

  $('sid-input').classList.remove('error');
  $('login-err').classList.remove('show');
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(student));
  window.dispatchEvent(new CustomEvent('app:login', { detail: student }));
}

/**
 * Read the saved session from sessionStorage.
 * Returns the user object if found, null otherwise.
 * @returns {object|null}
 */
export function getStoredUser() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}
