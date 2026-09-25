import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet, Mail, Lock, User as UserIcon, Loader2, ArrowRight } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials, setAuthError, setAuthLoading } from '@/store/authSlice';
import { registerUser } from '@/api/auth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    dispatch(setAuthLoading());
    try {
      const { user, token } = await registerUser(name, email, password);
      dispatch(setCredentials({ user, token }));
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg =
        err instanceof Error && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : 'Registration failed';
      setError(msg || 'Registration failed');
      dispatch(setAuthError(msg || 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500">
            <Wallet className="h-7 w-7 text-white" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-navy-900">MoneyPilot</h1>
          <p className="mt-1 text-sm text-gray-500">Create your account</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-800">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-navy-900 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-800">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-navy-900 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-800">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-navy-900 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  placeholder="At least 6 characters"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
