import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    const accounts = await this.prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
    return { accounts };
  }

  async findOne(userId: string, id: string) {
    const account = await this.prisma.account.findFirst({
      where: { id, userId },
    });
    if (!account) throw new NotFoundException('Account not found');

    const transactions = await this.prisma.transaction.findMany({
      where: { accountId: account.id },
      orderBy: { transactionDate: 'desc' },
      take: 10,
    });

    return { account, transactions };
  }
}
