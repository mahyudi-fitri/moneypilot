import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { prisma } from '../prisma/client.js';

export interface AuthRequest extends Request {
  userId?: string;
}

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = header.slice(7);
    const payload = jwt.verify(token, config.jwtSecret) as { sub: string };

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.userId = user.id;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
