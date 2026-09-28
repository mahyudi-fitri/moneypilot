export const TOKEN_COOKIE = 'moneypilot_token';

const TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * The auth token lives in a cookie (instead of localStorage) so that Next.js
 * middleware and server components can read it and perform auth checks before
 * any protected UI is rendered.
 */
export function getToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function setToken(token: string) {
  if (typeof document === 'undefined') return;
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(
    token
  )}; Path=/; Max-Age=${TOKEN_MAX_AGE}; SameSite=Lax${secure}`;
}

export function clearToken() {
  if (typeof document === 'undefined') return;
  document.cookie = `${TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}
