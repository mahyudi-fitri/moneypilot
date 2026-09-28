import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { TransactionQuery } from './transactions.schema.js';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, query: TransactionQuery) {
    const { accountId, type, startDate, endDate, search } = query;

    const where: Prisma.TransactionWhereInput = { userId };

    if (accountId && accountId !== 'all') where.accountId = accountId;
    if (type && type !== 'all') where.type = type;

    if (search && search.trim()) {
      where.OR = [
        { description: { contains: search, mode: 'insensitive' } },
        { merchant: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (startDate || endDate) {
      const transactionDate: Prisma.DateTimeFilter = {};
      if (startDate) transactionDate.gte = new Date(startDate);
      if (endDate) transactionDate.lte = new Date(endDate);
      where.transactionDate = transactionDate;
    }

    const transactions = await this.prisma.transaction.findMany({
      where,
      include: { account: { select: { name: true } } },
      orderBy: { transactionDate: 'desc' },
    });

    return { transactions };
  }

  async findOne(userId: string, id: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, userId },
      include: { account: { select: { name: true } } },
    });
    if (!transaction) throw new NotFoundException('Transaction not found');
    return { transaction };
  }
}
