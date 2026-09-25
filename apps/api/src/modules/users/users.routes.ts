import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../../middleware/auth.js';
import { prisma } from '../../prisma/client.js';

const router = Router();

router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, name: true, email: true, createdAt: true },
  });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

export default router;
