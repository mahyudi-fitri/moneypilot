import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/configuration.js';
import { HealthController } from './health.controller.js';
import { AccountsModule } from './modules/accounts/accounts.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { CardsModule } from './modules/cards/cards.module.js';
import { DashboardModule } from './modules/dashboard/dashboard.module.js';
import { LoansModule } from './modules/loans/loans.module.js';
import { TransactionsModule } from './modules/transactions/transactions.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    PrismaModule,
    AuthModule,
    AccountsModule,
    CardsModule,
    LoansModule,
    TransactionsModule,
    DashboardModule,
    UsersModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
