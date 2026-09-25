import { useEffect, useState } from 'react';
import { Search, ReceiptText, ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';
import api from '@/api/client';
import type { Transaction, Account } from '@/types';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/States';
import { formatCurrency, formatDate } from '@/utils/format';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [accountFilter, setAccountFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    api.get('/accounts').then((res) => setAccounts(res.data.accounts)).catch(() => {});
  }, []);

  const fetchTransactions = () => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (accountFilter !== 'all') params.accountId = accountFilter;
    if (typeFilter !== 'all') params.type = typeFilter;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    api
      .get('/transactions', { params })
      .then((res) => setTransactions(res.data.transactions))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load transactions'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timeout = setTimeout(fetchTransactions, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, accountFilter, typeFilter, startDate, endDate]);

  if (loading && transactions.length === 0) return <LoadingSpinner label="Loading transactions..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy-900">Transactions</h2>
        <p className="mt-1 text-sm text-gray-500">Search and filter your transaction history</p>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {/* Search */}
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search merchant, description..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Account filter */}
          <select
            value={accountFilter}
            onChange={(e) => setAccountFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
          >
            <option value="all">All Accounts</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
          >
            <option value="all">All Types</option>
            <option value="CREDIT">Credit</option>
            <option value="DEBIT">Debit</option>
          </select>

          {/* Date range */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-2 py-2 text-xs outline-none focus:border-emerald-500"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-2 py-2 text-xs outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {(search || accountFilter !== 'all' || typeFilter !== 'all' || startDate || endDate) && (
          <button
            onClick={() => {
              setSearch('');
              setAccountFilter('all');
              setTypeFilter('all');
              setStartDate('');
              setEndDate('');
            }}
            className="mt-3 flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-navy-900"
          >
            <Filter className="h-3 w-3" /> Clear filters
          </button>
        )}
      </div>

      {/* Transactions list */}
      {transactions.length === 0 ? (
        <EmptyState
          title="No transactions found"
          description="Try adjusting your search or filters to see transactions."
          icon={ReceiptText}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500">
                  <th className="px-4 py-3">Merchant</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Category</th>
                  <th className="hidden px-4 py-3 lg:table-cell">Account</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
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
                          <p className="text-xs text-gray-400 sm:hidden">{tx.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-sm text-gray-600 sm:table-cell">{tx.category}</td>
                    <td className="hidden px-4 py-3 text-sm text-gray-600 lg:table-cell">
                      {tx.account?.name || '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatDate(tx.transactionDate)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          tx.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-600'
                            : tx.status === 'PENDING'
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`text-sm font-semibold ${
                          tx.type === 'CREDIT' ? 'text-emerald-600' : 'text-navy-900'
                        }`}
                      >
                        {tx.type === 'CREDIT' ? '+' : '-'}
                        {formatCurrency(tx.amount)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
