import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './modules/auth/auth.routes.js';
import accountRoutes from './modules/accounts/accounts.routes.js';
import cardRoutes from './modules/cards/cards.routes.js';
import loanRoutes from './modules/loans/loans.routes.js';
import transactionRoutes from './modules/transactions/transactions.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import userRoutes from './modules/users/users.routes.js';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: config.clientUrl,
      credentials: true,
    })
  );
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.use('/api/auth', authRoutes);
  app.use('/api/accounts', accountRoutes);
  app.use('/api/cards', cardRoutes);
  app.use('/api/loans', loanRoutes);
  app.use('/api/transactions', transactionRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api/users', userRoutes);

  app.use(errorHandler);

  return app;
}
