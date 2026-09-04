import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import ClientProviders from '@/components/ClientProviders';
import { getContentSection, getSocialLinks } from '@/app/actions';
import { GlobalStateProvider } from '@/lib/GlobalState';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaishanth.dev';

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(baseUrl),
    title: 'Jaishanth | Cybersecurity Student | Ethical Hacker & Red Teaming',
    description: 'Jaishanth is a Cybersecurity student at Dr. Mahalingam College of Engineering and Technology focused on ethical hacking, penetration testing, vulnerability assessment, web security, red teaming, and security research.',
    keywords: [
      'Jaishanth cybersecurity',
      'Jaishanth ethical hacker',
      'Jaishanth penetration testing',
      'cybersecurity student India',
      'ethical hacking student',
      'offensive security',
      'red teaming',
      'vulnerability assessment',
      'web security',
      'penetration tester',
      'security researcher',
      'Dr Mahalingam College of Engineering and Technology cybersecurity',
      'MCET Pollachi',
      'TryHackMe'
    ],
    alternates: {
      canonical: '/',
    },
    openGraph: {
      title: 'Jaishanth | Cybersecurity Student | Ethical Hacker & Red Teaming',
      description: 'Jaishanth is a Cybersecurity student at Dr. Mahalingam College of Engineering and Technology focused on ethical hacking, penetration testing, vulnerability assessment, web security, red teaming, and security research.',
      url: baseUrl,
      type: 'website',
      siteName: 'Jaishanth Cybersecurity Portfolio',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Jaishanth | Cybersecurity Student | Ethical Hacker & Red Teaming',
      description: 'Jaishanth is a Cybersecurity student at Dr. Mahalingam College of Engineering and Technology focused on ethical hacking, penetration testing, vulnerability assessment, web security, red teaming, and security research.',
    },
    robots: 'index, follow',
  };
}

export const revalidate = 60; // Cache pages for 60 seconds to prevent DB spam

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [homeCfg, navbarCfg, footerCfg, profileCfg, socialLinks] = await Promise.all([
    getContentSection('home'),
    getContentSection('navbar'),
    getContentSection('footer'),
    getContentSection('profile'),
    getSocialLinks()
  ]);

  const initialState = { homeCfg, navbarCfg, footerCfg, profileCfg, socialLinks };

  return (
    <html lang="en" data-scroll-behavior="smooth">
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
