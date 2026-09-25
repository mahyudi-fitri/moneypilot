import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../../middleware/auth.js';
import { prisma } from '../../prisma/client.js';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const loans = await prisma.loan.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: 'asc' },
  });
  res.json({ loans });
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const loan = await prisma.loan.findFirst({
    where: { id: req.params.id, userId: req.userId },
  });
  if (!loan) return res.status(404).json({ error: 'Loan not found' });
  res.json({ loan });
});

export default router;
