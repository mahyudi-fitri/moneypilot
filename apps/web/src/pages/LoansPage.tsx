import { useEffect, useState } from 'react';
import { Landmark, Calendar, DollarSign, Percent } from 'lucide-react';
import api from '@/api/client';
import type { Loan } from '@/types';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/States';
import { formatCurrency, formatDate } from '@/utils/format';

const typeLabels: Record<string, string> = {
  PERSONAL: 'Personal Loan',
  CAR: 'Car Financing',
  HOME: 'Home Financing',
  EDUCATION: 'Education Financing',
};

const typeColors: Record<string, string> = {
  PERSONAL: 'bg-blue-50 text-blue-700',
  CAR: 'bg-amber-50 text-amber-700',
  HOME: 'bg-emerald-50 text-emerald-700',
  EDUCATION: 'bg-purple-50 text-purple-700',
};

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get('/loans')
      .then((res) => setLoans(res.data.loans))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load loans'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading loans..." />;
  if (error) return <ErrorState message={error} />;
  if (loans.length === 0)
    return (
      <EmptyState
        title="No loans yet"
        description="You don't have any active loans or financing."
        icon={Landmark}
      />
    );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy-900">Loans & Financing</h2>
        <p className="mt-1 text-sm text-gray-500">Track your outstanding loans and financing</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {loans.map((loan) => {
          const progressPercent =
            parseFloat(loan.principalAmount) > 0
              ? ((parseFloat(loan.principalAmount) - parseFloat(loan.outstandingBalance)) /
                  parseFloat(loan.principalAmount)) *
                100
              : 0;

          return (
            <div key={loan.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-100 text-navy-600">
                    <Landmark className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-900">{loan.name}</h3>
                    <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColors[loan.type]}`}>
                      {typeLabels[loan.type]}
                    </span>
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  loan.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
                }`}>
                  {loan.status}
                </span>
              </div>

              {/* Balance section */}
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Principal</p>
                  <p className="mt-1 text-lg font-bold text-navy-900">{formatCurrency(loan.principalAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Outstanding</p>
                  <p className="mt-1 text-lg font-bold text-red-600">{formatCurrency(loan.outstandingBalance)}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Repaid</span>
                  <span>{progressPercent.toFixed(1)}%</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>

              {/* Details grid */}
              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Monthly</p>
                    <p className="text-sm font-medium text-navy-900">{formatCurrency(loan.monthlyInstallment)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Rate</p>
                    <p className="text-sm font-medium text-navy-900">{loan.rate}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Next Payment</p>
                    <p className="text-sm font-medium text-navy-900">{formatDate(loan.nextPaymentDate)}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
