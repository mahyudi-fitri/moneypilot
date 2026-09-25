import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class LoansService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    const loans = await this.prisma.loan.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
    return { loans };
  }

  async findOne(userId: string, id: string) {
    const loan = await this.prisma.loan.findFirst({ where: { id, userId } });
    if (!loan) throw new NotFoundException('Loan not found');
    return { loan };
  }
}
