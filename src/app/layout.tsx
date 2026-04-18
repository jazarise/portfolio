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
    title: `${homeCfg.heading || 'Jaishanth'} · ${homeCfg.subheading || 'Cybersecurity & Dev'}`,
    description: homeCfg.bio || 'Cybersecurity enthusiast, ethical hacker, and full-stack developer.',
    keywords: ['cybersecurity', 'developer', 'portfolio', 'ethical hacker', 'penetration testing'],
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
