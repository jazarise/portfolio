import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import ClientProviders from '@/components/ClientProviders';
import { getContentSection, getSocialLinks } from '@/app/actions';
import { GlobalStateProvider } from '@/lib/GlobalState';

export async function generateMetadata(): Promise<Metadata> {
  const homeCfg = await getContentSection('home');
  return {
    title: `${homeCfg.heading || 'Jaishanth'} · Cybersecurity Student & Aspiring Red Teamer`,
    description: homeCfg.bio || 'Cybersecurity student focused on penetration testing, red teaming, and offensive security. Hands-on experience with TryHackMe, HackTheBox, and real-world security labs.',
    keywords: ['cybersecurity', 'ethical hacking', 'red team', 'penetration testing', 'portfolio', 'security researcher', 'TryHackMe', 'HackTheBox', 'VAPT', 'offensive security'],
    openGraph: {
      title: `${homeCfg.heading || 'Jaishanth'} — Cybersecurity Portfolio`,
      description: 'Aspiring Red Teamer with hands-on experience in penetration testing, network security, and vulnerability assessment.',
      type: 'website',
      siteName: 'jaiz_sec',
    },
    robots: 'index, follow',
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [homeCfg, navbarCfg, footerCfg, socialLinks] = await Promise.all([
    getContentSection('home'),
    getContentSection('navbar'),
    getContentSection('footer'),
    getSocialLinks()
  ]);

  const initialState = { homeCfg, navbarCfg, footerCfg, socialLinks };

  return (
    <html lang="en">
      <body className="antialiased font-sans text-gray-200 bg-dark-main">
        <GlobalStateProvider initialState={initialState}>
          <ClientProviders>
            <ScrollProgress />
            <Navbar />
            <main className="relative z-10">
              {children}
            </main>
            <Footer />
          </ClientProviders>
        </GlobalStateProvider>
      </body>
    </html>
  );
}
