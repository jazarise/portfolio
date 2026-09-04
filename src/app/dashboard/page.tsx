import type { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
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
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (err) {
    console.warn('Dashboard getServerSession fallback:', err);
  }

  // Pass initial session state to client component safely
  return <DashboardContent initialAuthenticated={!!session} />;
}
