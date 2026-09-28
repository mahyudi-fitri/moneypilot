import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(userId: string) {
    const accounts = await this.prisma.account.findMany({
      where: { userId, status: 'ACTIVE' },
    });

    const loans = await this.prisma.loan.findMany({
      where: { userId, status: 'ACTIVE' },
    });

    const cards = await this.prisma.card.findMany({
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

    const monthlyTransactions = await this.prisma.transaction.findMany({
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

    const recentTransactions = await this.prisma.transaction.findMany({
      where: { userId },
      include: { account: { select: { name: true } } },
      orderBy: { transactionDate: 'desc' },
      take: 5,
    });

    return {
      totalBalance,
      totalDebt,
      monthlySpending,
      activeCards: cards.length,
      activeAccounts: accounts.length,
      activeLoans: loans.length,
      recentTransactions,
      accounts,
      loans,
    };
  }
}
