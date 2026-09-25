import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../../middleware/auth.js';
import { prisma } from '../../prisma/client.js';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const cards = await prisma.card.findMany({
    where: { userId: req.userId },
    include: { account: { select: { name: true } } },
    orderBy: { createdAt: 'asc' },
  });
  res.json({ cards });
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const card = await prisma.card.findFirst({
    where: { id: req.params.id, userId: req.userId },
    include: { account: { select: { name: true } } },
  });
  if (!card) return res.status(404).json({ error: 'Card not found' });
  res.json({ card });
});

export default router;
