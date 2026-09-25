import api from './client';
import type { User } from '@/types';

export async function registerUser(name: string, email: string, password: string) {
  const res = await api.post('/auth/register', { name, email, password });
  return res.data as { user: User; token: string };
}

export async function loginUser(email: string, password: string) {
  const res = await api.post('/auth/login', { email, password });
  return res.data as { user: User; token: string };
}

export async function getMe() {
  const res = await api.get('/auth/me');
  return res.data.user as User;
}
