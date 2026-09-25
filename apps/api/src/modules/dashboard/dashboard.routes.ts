import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../../middleware/auth.js';
import { prisma } from '../../prisma/client.js';

const router = Router();

router.get('/summary', authMiddleware, async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;

  const accounts = await prisma.account.findMany({
    where: { userId, status: 'ACTIVE' },
  });

  const loans = await prisma.loan.findMany({
    where: { userId, status: 'ACTIVE' },
  });

  const cards = await prisma.card.findMany({
    where: { userId, status: 'ACTIVE' },
  });

  const totalBalance = accounts.reduce(
    (sum, a) => sum + a.balance.toNumber(),
    0
  );

  const totalDebt = loans.reduce(
    (sum, l) => sum + l.outstandingBalance.toNumber(),
    0
  );

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthlyTransactions = await prisma.transaction.findMany({
    where: {
      userId,
      type: 'DEBIT',
      status: 'COMPLETED',
      transactionDate: { gte: startOfMonth },
    },
  });

  const monthlySpending = monthlyTransactions.reduce(
    (sum, t) => sum + t.amount.toNumber(),
    0
  );

  const recentTransactions = await prisma.transaction.findMany({
    where: { userId },
    include: { account: { select: { name: true } } },
    orderBy: { transactionDate: 'desc' },
    take: 5,
  });

  res.json({
    totalBalance,
    totalDebt,
    monthlySpending,
    activeCards: cards.length,
    activeAccounts: accounts.length,
    activeLoans: loans.length,
    recentTransactions,
    accounts,
    loans,
  });
});

export default router;
