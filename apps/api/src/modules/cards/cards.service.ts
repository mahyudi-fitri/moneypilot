import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class CardsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    const cards = await this.prisma.card.findMany({
      where: { userId },
      include: { account: { select: { name: true } } },
      orderBy: { createdAt: 'asc' },
    });
    return { cards };
  }

  async findOne(userId: string, id: string) {
    const card = await this.prisma.card.findFirst({
      where: { id, userId },
      include: { account: { select: { name: true } } },
    });
    if (!card) throw new NotFoundException('Card not found');
    return { card };
  }
}
