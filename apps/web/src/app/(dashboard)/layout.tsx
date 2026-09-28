import { requireAuth } from '@/lib/server-auth';
import DashboardShell from '@/components/DashboardShell';

export default async function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side auth check; middleware already blocks unauthenticated requests,
  // this is the defence-in-depth check for the protected segment itself.
  await requireAuth();

  return <DashboardShell>{children}</DashboardShell>;
}
