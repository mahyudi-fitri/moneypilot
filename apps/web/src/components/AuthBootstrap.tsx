'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { hydrateToken, setCredentials } from '@/store/authSlice';
import { getToken } from '@/lib/token';
import { getMe } from '@/api/auth';

/**
 * Restores the Redux auth state on the client after a full page load, since the
 * token cookie cannot be read while rendering on the server-side store.
 */
export default function AuthBootstrap() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) return;
    const token = getToken();
    if (!token) return;

    dispatch(hydrateToken(token));
    getMe()
      .then((me) => dispatch(setCredentials({ user: me, token })))
      .catch(() => {});
  }, [dispatch, user]);

  return null;
}
