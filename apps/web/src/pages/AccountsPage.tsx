import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Plus } from 'lucide-react';
import api from '@/api/client';
import type { Account } from '@/types';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/States';
import { formatCurrency, maskAccountNumber } from '@/utils/format';

const typeColors: Record<string, string> = {
  SAVINGS: 'bg-emerald-50 text-emerald-700',
  CURRENT: 'bg-blue-50 text-blue-700',
  INVESTMENT: 'bg-purple-50 text-purple-700',
};

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get('/accounts')
      .then((res) => setAccounts(res.data.accounts))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load accounts'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading accounts..." />;
  if (error) return <ErrorState message={error} />;
  if (accounts.length === 0)
    return (
      <EmptyState
        title="No accounts yet"
        description="You don't have any bank accounts linked to your profile."
        icon={Wallet}
      />
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy-900">Bank Accounts</h2>
          <p className="mt-1 text-sm text-gray-500">Manage your savings, current, and investment accounts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <Link
            key={account.id}
            to={`/accounts/${account.id}`}
            className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-emerald-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-100 text-navy-600">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-navy-900">{account.name}</p>
                  <p className="text-xs text-gray-500">{maskAccountNumber(account.accountNumberLast4)}</p>
                </div>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${typeColors[account.type]}`}>
                {account.type}
              </span>
            </div>

            <div className="mt-4 border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-500">Available Balance</p>
              <p className="mt-1 text-2xl font-bold text-navy-900">
                {formatCurrency(account.balance, account.currency)}
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-gray-400">{account.currency}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  account.status === 'ACTIVE'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {account.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
