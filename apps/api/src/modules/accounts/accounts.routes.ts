import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../../middleware/auth.js';
import { prisma } from '../../prisma/client.js';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const accounts = await prisma.account.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: 'asc' },
  });
  res.json({ accounts });
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const account = await prisma.account.findFirst({
    where: { id: req.params.id, userId: req.userId },
  });
  if (!account) return res.status(404).json({ error: 'Account not found' });

  const transactions = await prisma.transaction.findMany({
    where: { accountId: account.id },
    orderBy: { transactionDate: 'desc' },
    take: 10,
  });

  res.json({ account, transactions });
});

export default router;
