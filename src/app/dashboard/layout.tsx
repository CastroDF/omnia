import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import DashboardNav from '@/components/DashboardNav';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || !session.user) {
    redirect('/api/auth/signin');
  }

  return (
    <>
      <DashboardNav />
      {children}
    </>
  );
}
