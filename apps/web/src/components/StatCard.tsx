import { TrendingUp, TrendingDown, Wallet, CreditCard, Landmark } from 'lucide-react';
import { formatCurrency } from '@/utils/format';

interface StatCardProps {
  label: string;
  value: string;
  icon: 'balance' | 'debt' | 'spending' | 'cards';
  trend?: string;
}

const iconMap = {
  balance: Wallet,
  debt: Landmark,
  spending: TrendingDown,
  cards: CreditCard,
};

const colorMap = {
  balance: 'bg-emerald-50 text-emerald-600',
  debt: 'bg-red-50 text-red-600',
  spending: 'bg-amber-50 text-amber-600',
  cards: 'bg-blue-50 text-blue-600',
};

export default function StatCard({ label, value, icon, trend }: StatCardProps) {
  const Icon = iconMap[icon];
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-navy-900">{value}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${colorMap[icon]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1 text-xs">
          <TrendingUp className="h-3 w-3 text-emerald-500" />
          <span className="text-emerald-600">{trend}</span>
        </div>
      )}
    </div>
  );
}

export { formatCurrency };
