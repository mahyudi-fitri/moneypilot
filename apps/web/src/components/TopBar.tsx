import { useNavigate } from 'react-router-dom';
import { Menu, LogOut, User as UserIcon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearCredentials } from '@/store/authSlice';

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(clearCredentials());
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="text-navy-700 hover:text-navy-900 lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold text-navy-900">Welcome back, {user?.name?.split(' ')[0] || 'User'}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white">
            <UserIcon className="h-4 w-4" />
          </div>
          <span className="hidden text-sm font-medium text-navy-800 sm:block">
            {user?.name || 'User'}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-navy-700 transition-colors hover:bg-gray-100 hover:text-navy-900"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </header>
  );
}
