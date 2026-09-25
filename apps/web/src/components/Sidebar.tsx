import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  CreditCard,
  Landmark,
  ReceiptText,
  User,
  X,
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/accounts', label: 'Accounts', icon: Wallet },
  { to: '/cards', label: 'Cards', icon: CreditCard },
  { to: '/loans', label: 'Loans & Financing', icon: Landmark },
  { to: '/transactions', label: 'Transactions', icon: ReceiptText },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-navy-950/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 flex w-72 flex-col bg-navy-900 text-white transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">MoneyPilot</span>
          </div>
          <button
            onClick={onClose}
            className="text-navy-300 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-500 text-white'
                    : 'text-navy-200 hover:bg-navy-800 hover:text-white'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-6 py-4 text-xs text-navy-400">
          <p>Demo project — not real banking.</p>
        </div>
      </aside>
    </>
  );
}
