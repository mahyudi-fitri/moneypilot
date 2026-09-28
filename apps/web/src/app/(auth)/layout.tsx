import { redirectIfAuthenticated } from '@/lib/server-auth';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  // Already signed-in visitors never see the login/register screens.
  await redirectIfAuthenticated();

  return <>{children}</>;
}
