import DashboardWrapper from '@/components/layouts/DashboardWrapper';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authentication is handled by middleware.ts using withAuth
  // Users can only reach this layout if they're authenticated
  return <DashboardWrapper>{children}</DashboardWrapper>;
}
