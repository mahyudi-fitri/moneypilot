import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../../middleware/auth.js';
import { prisma } from '../../prisma/client.js';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { accountId, type, startDate, endDate, search } = req.query;

  const where: Record<string, unknown> = { userId: req.userId };

  if (accountId && accountId !== 'all') where.accountId = accountId;
  if (type && type !== 'all') where.type = type;
  if (search && typeof search === 'string' && search.trim()) {
    where.OR = [
      { description: { contains: search, mode: 'insensitive' } },
      { merchant: { contains: search, mode: 'insensitive' } },
      { category: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (startDate || endDate) {
    where.transactionDate = {};
    if (startDate) (where.transactionDate as Record<string, unknown>).gte = new Date(startDate as string);
    if (endDate) (where.transactionDate as Record<string, unknown>).lte = new Date(endDate as string);
  }

  const transactions = await prisma.transaction.findMany({
    where: where as never,
    include: { account: { select: { name: true } } },
    orderBy: { transactionDate: 'desc' },
  });

  res.json({ transactions });
});

router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const transaction = await prisma.transaction.findFirst({
    where: { id: req.params.id, userId: req.userId },
    include: { account: { select: { name: true } } },
  });
  if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
  res.json({ transaction });
});

export default router;
