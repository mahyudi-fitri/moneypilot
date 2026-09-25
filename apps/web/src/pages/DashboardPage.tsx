import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ReceiptText, ArrowUpRight, ArrowDownRight, Wallet, Landmark } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDashboardSummary } from '@/store/dataSlice';
import StatCard from '@/components/StatCard';
import { LoadingSpinner, ErrorState } from '@/components/States';
import { formatCurrency, formatDate } from '@/utils/format';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { summary, status, error } = useAppSelector((state) => state.data);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDashboardSummary());
    }
  }, [dispatch, status]);

  if (status === 'loading') return <LoadingSpinner label="Loading dashboard..." />;
  if (status === 'failed') return <ErrorState message={error || 'Failed to load dashboard'} />;
  if (!summary) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy-900">Overview</h2>
        <p className="mt-1 text-sm text-gray-500">Your financial summary at a glance</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Balance"
          value={formatCurrency(summary.totalBalance)}
          icon="balance"
          trend="Across all accounts"
        />
        <StatCard
          label="Total Debt"
          value={formatCurrency(summary.totalDebt)}
          icon="debt"
          trend="Outstanding financing"
        />
        <StatCard
          label="Monthly Spending"
          value={formatCurrency(summary.monthlySpending)}
          icon="spending"
          trend="This month"
        />
        <StatCard
          label="Active Cards"
          value={String(summary.activeCards)}
          icon="cards"
          trend={`${summary.activeAccounts} accounts`}
        />
      </div>

      {/* Recent transactions + Account summary */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent transactions */}
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-navy-900">Recent Transactions</h3>
            <Link
              to="/transactions"
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              View all
            </Link>
          </div>
          {summary.recentTransactions.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">No transactions yet</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {summary.recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                        tx.type === 'CREDIT'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {tx.type === 'CREDIT' ? (
                        <ArrowDownRight className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-navy-900">{tx.merchant}</p>
                      <p className="text-xs text-gray-500">
                        {tx.category} • {formatDate(tx.transactionDate)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      tx.type === 'CREDIT' ? 'text-emerald-600' : 'text-navy-900'
                    }`}
                  >
                    {tx.type === 'CREDIT' ? '+' : '-'}
                    {formatCurrency(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Account summary */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-navy-900">Accounts</h3>
            <Link
              to="/accounts"
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {summary.accounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-100 text-navy-600">
                    <Wallet className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy-900">{account.name}</p>
                    <p className="text-xs text-gray-500">{account.type}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-navy-900">
                  {formatCurrency(account.balance)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Loan summary */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-navy-900">Loans & Financing</h3>
          <Link
            to="/loans"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {summary.loans.map((loan) => (
            <div key={loan.id} className="rounded-lg border border-gray-100 p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <Landmark className="h-4 w-4" />
                </div>
                <p className="text-sm font-medium text-navy-900">{loan.name}</p>
              </div>
              <p className="mt-3 text-xs text-gray-500">Outstanding</p>
              <p className="text-lg font-bold text-navy-900">
                {formatCurrency(loan.outstandingBalance)}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Next payment: {formatDate(loan.nextPaymentDate)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
