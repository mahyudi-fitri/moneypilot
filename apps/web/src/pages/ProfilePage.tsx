import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Mail, Calendar, LogOut, Shield } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearCredentials } from '@/store/authSlice';
import { clearData } from '@/store/dataSlice';
import api from '@/api/client';
import type { User } from '@/types';
import { formatDate } from '@/utils/format';

export default function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const storedUser = useAppSelector((state) => state.auth.user);
  const [user, setUser] = useState<User | null>(storedUser);

  useEffect(() => {
    if (!storedUser) {
      api.get('/users/me').then((res) => setUser(res.data.user)).catch(() => {});
    }
  }, [storedUser]);

  const handleLogout = () => {
    dispatch(clearCredentials());
    dispatch(clearData());
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy-900">Profile</h2>
        <p className="mt-1 text-sm text-gray-500">Your account information</p>
      </div>

      {/* Profile card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white">
            <UserIcon className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-navy-900">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="mt-6 space-y-4 border-t border-gray-100 pt-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
              <UserIcon className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Full Name</p>
              <p className="text-sm font-medium text-navy-900">{user.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
              <Mail className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Email Address</p>
              <p className="text-sm font-medium text-navy-900">{user.email}</p>
            </div>
          </div>

          {user.createdAt && (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                <Calendar className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Member Since</p>
                <p className="text-sm font-medium text-navy-900">{formatDate(user.createdAt)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Security note */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 flex-shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-medium text-amber-800">Demo Project</p>
            <p className="mt-1 text-xs text-amber-700">
              This is a portfolio/demo application. It does not connect to real banks and should not be
              used for real financial operations.
            </p>
          </div>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </div>
  );
}
