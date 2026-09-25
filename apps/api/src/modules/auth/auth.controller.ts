import type { Response } from 'express';
import type { AuthRequest } from '../../middleware/auth.js';
import * as authService from './auth.service.js';

export async function register(req: AuthRequest, res: Response) {
  const { user, token } = await authService.register(req.body);
  res.status(201).json({ user, token });
}

export async function login(req: AuthRequest, res: Response) {
  try {
    const { user, token } = await authService.login(req.body);
    res.json({ user, token });
  } catch (err) {
    if (err instanceof Error && err.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    throw err;
  }
}

export async function logout(_req: AuthRequest, res: Response) {
  // Stateless JWT — client discards the token. We return success.
  res.json({ message: 'Logged out' });
}

export async function me(req: AuthRequest, res: Response) {
  const user = await authService.getMe(req.userId!);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
}
