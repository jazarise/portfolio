/**
 * Runtime-mutable admin credentials store.
 * Falls back to environment variables for defaults.
 * Changes persist in memory only (resets on server restart to env vars).
 * For persistent credential changes in production, store in DB or encrypted file.
 */

let _username: string = process.env.ADMIN_USERNAME || 'JAISHANTH';
let _password: string = process.env.ADMIN_PASSWORD || 'Jaims@1402';

export function getAdminCredentials() {
  return { username: _username, password: _password };
}

export function updateAdminCredentials(newUsername: string, newPassword: string) {
  if (!newUsername || !newPassword) {
    throw new Error('Username and password are required.');
  }
  if (newPassword.length < 8) {
    throw new Error('Password must be at least 8 characters.');
  }
  _username = newUsername;
  _password = newPassword;
  return true;
}
