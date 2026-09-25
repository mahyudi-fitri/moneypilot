import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import DashboardLayout from '@/components/DashboardLayout';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import AccountsPage from '@/pages/AccountsPage';
import AccountDetailPage from '@/pages/AccountDetailPage';
import CardsPage from '@/pages/CardsPage';
import LoansPage from '@/pages/LoansPage';
import TransactionsPage from '@/pages/TransactionsPage';
import ProfilePage from '@/pages/ProfilePage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAppSelector((state) => state.auth.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="accounts" element={<AccountsPage />} />
          <Route path="accounts/:id" element={<AccountDetailPage />} />
          <Route path="cards" element={<CardsPage />} />
          <Route path="loans" element={<LoansPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
