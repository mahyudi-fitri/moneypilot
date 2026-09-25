export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: 'SAVINGS' | 'CURRENT' | 'INVESTMENT';
  accountNumberLast4: number;
  currency: string;
  balance: string;
  status: 'ACTIVE' | 'DORMANT' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
}

export interface Card {
  id: string;
  userId: string;
  accountId: string;
  name: string;
  type: 'DEBIT' | 'CREDIT';
  cardNumberLast4: number;
  expiryMonth: number;
  expiryYear: number;
  limit: string;
  currentSpending: string;
  status: 'ACTIVE' | 'FROZEN' | 'EXPIRED';
  account?: { name: string };
  createdAt: string;
  updatedAt: string;
}

export interface Loan {
  id: string;
  userId: string;
  name: string;
  type: 'PERSONAL' | 'CAR' | 'HOME' | 'EDUCATION';
  principalAmount: string;
  outstandingBalance: string;
  monthlyInstallment: string;
  rate: string;
  nextPaymentDate: string;
  status: 'ACTIVE' | 'CLOSED' | 'DEFAULTED';
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  cardId: string | null;
  type: 'CREDIT' | 'DEBIT';
  category: string;
  description: string;
  merchant: string;
  amount: string;
  currency: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  transactionDate: string;
  account?: { name: string };
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSummary {
  totalBalance: number;
  totalDebt: number;
  monthlySpending: number;
  activeCards: number;
  activeAccounts: number;
  activeLoans: number;
  recentTransactions: Transaction[];
  accounts: Account[];
  loans: Loan[];
}
