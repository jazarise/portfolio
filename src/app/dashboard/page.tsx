import type { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import DashboardContent from './DashboardContent';

export const metadata: Metadata = {
  title: 'Admin Dashboard · jaiz_sec',
  description: 'Secure admin control panel.',
  robots: 'noindex, nofollow', // Prevent search engine indexing
};

// Force dynamic — never cache the admin page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  // Server-side auth check — redirect handled by middleware, but this is a double-guard
  const session = await getServerSession(authOptions);

  // Pass initial session state to client component
  return <DashboardContent initialAuthenticated={!!session} />;
}
