/* ══════════════════════════════════════════
   Authentication — login / logout / session
══════════════════════════════════════════ */
import { $, toast } from './utils.js';
import { loginStudent, logoutUser, currentUser } from './api.js';

export async function handleLogin() {
  await doLogin($('sid-input').value.trim());
}

export async function quickLogin(id) {
  $('sid-input').value = id;
  await doLogin(id);
}

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
  window.dispatchEvent(new CustomEvent('app:login', { detail: student }));
}

export async function handleLogout() {
  await logoutUser();
  window.dispatchEvent(new CustomEvent('app:logout'));
  toast('Signed out.');
}

export async function restoreSession() {
  return currentUser();
}
