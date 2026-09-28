import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { TOKEN_COOKIE } from './token';

/** Server-side auth guard used by protected layouts. */
export async function requireAuth() {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  if (!token) redirect('/login');
  return token;
}

/** Server-side guard for auth pages (login/register). */
export async function redirectIfAuthenticated() {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  if (token) redirect('/dashboard');
}
