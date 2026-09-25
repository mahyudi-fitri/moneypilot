import { useEffect, useState } from 'react';
import { CreditCard, Snowflake, CheckCircle, XCircle } from 'lucide-react';
import api from '@/api/client';
import type { Card } from '@/types';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/States';
import { formatCurrency, maskCardNumber, formatExpiry } from '@/utils/format';

const statusConfig: Record<string, { icon: typeof CheckCircle; color: string }> = {
  ACTIVE: { icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600' },
  FROZEN: { icon: Snowflake, color: 'bg-blue-50 text-blue-600' },
  EXPIRED: { icon: XCircle, color: 'bg-gray-100 text-gray-500' },
};

export default function CardsPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get('/cards')
      .then((res) => setCards(res.data.cards))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load cards'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading cards..." />;
  if (error) return <ErrorState message={error} />;
  if (cards.length === 0)
    return (
      <EmptyState
        title="No cards yet"
        description="You don't have any cards linked to your accounts."
        icon={CreditCard}
      />
    );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy-900">Your Cards</h2>
        <p className="mt-1 text-sm text-gray-500">Debit and credit cards across your accounts</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const status = statusConfig[card.status];
          const StatusIcon = status.icon;
          const usagePercent = card.limit !== '0' && parseFloat(card.limit) > 0
            ? Math.min((parseFloat(card.currentSpending) / parseFloat(card.limit)) * 100, 100)
            : 0;

          return (
            <div key={card.id} className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              {/* Card visual */}
              <div
                className={`relative p-5 ${
                  card.type === 'CREDIT' ? 'bg-gradient-to-br from-navy-800 to-navy-950' : 'bg-gradient-to-br from-navy-700 to-navy-900'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-white/60">{card.type} CARD</p>
                    <p className="mt-1 text-lg font-semibold text-white">{card.name}</p>
                  </div>
                  <CreditCard className="h-6 w-6 text-white/70" />
                </div>
                <p className="mt-6 font-mono text-lg tracking-widest text-white/90">
                  {maskCardNumber(card.cardNumberLast4)}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-white/60">EXP {formatExpiry(card.expiryMonth, card.expiryYear)}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    card.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300' :
                    card.status === 'FROZEN' ? 'bg-blue-500/20 text-blue-300' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {card.status}
                  </span>
                </div>
              </div>

              {/* Card details */}
              <div className="p-5">
                {card.account && (
                  <p className="mb-3 text-xs text-gray-500">Linked to: <span className="font-medium text-navy-700">{card.account.name}</span></p>
                )}

                {card.type === 'CREDIT' && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Spending Limit</span>
                      <span className="font-medium text-navy-900">{formatCurrency(card.limit)}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-gray-500">Current Spending</span>
                      <span className="font-medium text-navy-900">{formatCurrency(card.currentSpending)}</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full ${usagePercent > 80 ? 'bg-red-500' : 'bg-emerald-500'}`}
                        style={{ width: `${usagePercent}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-400">{usagePercent.toFixed(0)}% used</p>
                  </div>
                )}

                <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full ${status.color}`}>
                    <StatusIcon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-navy-700">{card.status}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
