import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const passwordHash = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'demo@moneypilot.test' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@moneypilot.test',
      passwordHash,
    },
  });

  console.log(`Created user: ${user.email}`);

  // --- Accounts ---
  const savings = await prisma.account.create({
    data: {
      userId: user.id,
      name: 'Everyday Savings',
      type: 'SAVINGS',
      accountNumberLast4: 4821,
      currency: 'USD',
      balance: 24580.5,
      status: 'ACTIVE',
    },
  });

  const current = await prisma.account.create({
    data: {
      userId: user.id,
      name: 'Premier Current',
      type: 'CURRENT',
      accountNumberLast4: 7390,
      currency: 'USD',
      balance: 8320.75,
      status: 'ACTIVE',
    },
  });

  const investment = await prisma.account.create({
    data: {
      userId: user.id,
      name: 'Growth Investment',
      type: 'INVESTMENT',
      accountNumberLast4: 1156,
      currency: 'USD',
      balance: 51200.0,
      status: 'ACTIVE',
    },
  });

  console.log('Created 3 accounts');

  // --- Cards ---
  await prisma.card.create({
    data: {
      userId: user.id,
      accountId: current.id,
      name: 'Platinum Credit',
      type: 'CREDIT',
      cardNumberLast4: 8842,
      expiryMonth: 11,
      expiryYear: 2028,
      limit: 15000,
      currentSpending: 3240.5,
      status: 'ACTIVE',
    },
  });

  await prisma.card.create({
    data: {
      userId: user.id,
      accountId: savings.id,
      name: 'Everyday Debit',
      type: 'DEBIT',
      cardNumberLast4: 2210,
      expiryMonth: 3,
      expiryYear: 2027,
      limit: 0,
      currentSpending: 0,
      status: 'ACTIVE',
    },
  });

  await prisma.card.create({
    data: {
      userId: user.id,
      accountId: current.id,
      name: 'Travel Rewards',
      type: 'CREDIT',
      cardNumberLast4: 5573,
      expiryMonth: 8,
      expiryYear: 2026,
      limit: 25000,
      currentSpending: 7120.0,
      status: 'FROZEN',
    },
  });

  console.log('Created 3 cards');

  // --- Loans ---
  await prisma.loan.create({
    data: {
      userId: user.id,
      name: 'Personal Loan',
      type: 'PERSONAL',
      principalAmount: 20000,
      outstandingBalance: 12450.0,
      monthlyInstallment: 450.0,
      rate: 8.5,
      nextPaymentDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
      status: 'ACTIVE',
    },
  });

  await prisma.loan.create({
    data: {
      userId: user.id,
      name: 'Car Financing',
      type: 'CAR',
      principalAmount: 35000,
      outstandingBalance: 21800.0,
      monthlyInstallment: 620.0,
      rate: 5.2,
      nextPaymentDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
      status: 'ACTIVE',
    },
  });

  await prisma.loan.create({
    data: {
      userId: user.id,
      name: 'Home Financing',
      type: 'HOME',
      principalAmount: 280000,
      outstandingBalance: 245000.0,
      monthlyInstallment: 1850.0,
      rate: 4.1,
      nextPaymentDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
      status: 'ACTIVE',
    },
  });

  console.log('Created 3 loans');

  // --- Transactions ---
  const merchants = [
    { merchant: 'Amazon', category: 'Shopping', amount: 89.99 },
    { merchant: 'Starbucks', category: 'Food & Drink', amount: 6.75 },
    { merchant: 'Shell Gas', category: 'Transport', amount: 52.30 },
    { merchant: 'Netflix', category: 'Entertainment', amount: 15.99 },
    { merchant: 'Whole Foods', category: 'Groceries', amount: 127.45 },
    { merchant: 'Uber', category: 'Transport', amount: 23.50 },
    { merchant: 'Spotify', category: 'Entertainment', amount: 9.99 },
    { merchant: 'Electric Company', category: 'Utilities', amount: 145.0 },
    { merchant: 'Salary Deposit', category: 'Income', amount: 4200.0 },
    { merchant: 'Apple Store', category: 'Electronics', amount: 1299.0 },
    { merchant: 'CVS Pharmacy', category: 'Health', amount: 34.20 },
    { merchant: 'Cheesecake Factory', category: 'Food & Drink', amount: 78.60 },
    { merchant: 'Delta Airlines', category: 'Travel', amount: 445.0 },
    { merchant: ' Verizon', category: 'Utilities', amount: 85.0 },
    { merchant: 'Gym Membership', category: 'Health', amount: 39.99 },
    { merchant: 'Target', category: 'Shopping', amount: 156.32 },
    { merchant: 'Interest Earned', category: 'Income', amount: 42.18 },
    { merchant: 'Shell Gas', category: 'Transport', amount: 48.75 },
    { merchant: 'DoorDash', category: 'Food & Drink', amount: 31.40 },
    { merchant: 'Best Buy', category: 'Electronics', amount: 219.99 },
  ];

  const accountIds = [savings.id, current.id, investment.id];

  for (let i = 0; i < 20; i++) {
    const m = merchants[i];
    const isCredit = m.category === 'Income';
    const daysAgo = Math.floor(Math.random() * 30) + 1;
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

    await prisma.transaction.create({
      data: {
        userId: user.id,
        accountId: accountIds[i % 3],
        type: isCredit ? 'CREDIT' : 'DEBIT',
        category: m.category,
        description: m.merchant.trim() + ' purchase',
        merchant: m.merchant.trim(),
        amount: m.amount,
        currency: 'USD',
        status: i % 7 === 0 ? 'PENDING' : 'COMPLETED',
        transactionDate: date,
      },
    });
  }

  console.log('Created 20 transactions');
  console.log('Seed complete!');
  console.log('Login with: demo@moneypilot.test / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
