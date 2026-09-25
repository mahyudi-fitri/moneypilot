import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import api from '@/api/client';
import type { Account, Transaction } from '@/types';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/States';
import { formatCurrency, formatDate, maskAccountNumber } from '@/utils/format';

export default function AccountDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get(`/accounts/${id}`)
      .then((res) => {
        setAccount(res.data.account);
        setTransactions(res.data.transactions);
      })
      .catch((err) => setError(err.response?.data?.error || 'Failed to load account'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner label="Loading account..." />;
  if (error) return <ErrorState message={error} />;
  if (!account) return <ErrorState message="Account not found" />;

  return (
    <div className="space-y-6">
      <Link to="/accounts" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-navy-900">
        <ArrowLeft className="h-4 w-4" /> Back to accounts
      </Link>

      {/* Account info card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-navy-100 text-navy-600">
              <Wallet className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-navy-900">{account.name}</h2>
              <p className="text-sm text-gray-500">{maskAccountNumber(account.accountNumberLast4)}</p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-600">
            {account.status}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-gray-500">Type</p>
            <p className="mt-1 font-medium text-navy-900">{account.type}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Currency</p>
            <p className="mt-1 font-medium text-navy-900">{account.currency}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Status</p>
            <p className="mt-1 font-medium text-navy-900">{account.status}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Balance</p>
            <p className="mt-1 text-lg font-bold text-navy-900">
              {formatCurrency(account.balance, account.currency)}
            </p>
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 font-semibold text-navy-900">Recent Transactions</h3>
        {transactions.length === 0 ? (
          <EmptyState
            title="No transactions"
            description="This account has no transactions yet."
            icon={Wallet}
          />
        ) : (
          <div className="divide-y divide-gray-100">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      tx.type === 'CREDIT' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
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
    </div>
  );
}
